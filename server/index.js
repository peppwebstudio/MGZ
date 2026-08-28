const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Configuração Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const asaasAPI = axios.create({
  baseURL: process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3",
  headers: {
    access_token: process.env.ASAAS_API_KEY,
  },
});

// Helper: Sincroniza o cliente com o banco de dados (Supabase)
async function syncAthleteToSupabase({ name, email, asaasId }) {
  try {
    // Verifica se já existe
    const { data: existingAthlete } = await supabase
      .from("athletes")
      .select("id")
      .eq("email", email)
      .single();

    if (!existingAthlete) {
      await supabase.from("athletes").insert([{
        name,
        email,
        asaas_customer_id: asaasId,
        association_status: "pending"
      }]);
    } else {
      await supabase.from("athletes").update({ asaas_customer_id: asaasId }).eq("id", existingAthlete.id);
    }
  } catch (err) {
    console.error("Aviso: Erro ao sincronizar com Supabase:", err.message);
  }
}

// Helper: Busca cliente existente pelo CPF ou cria um novo
async function getOrCreateCustomer({ name, cpfCnpj, email, phone }) {
  let customerId = null;
  
  try {
    const search = await asaasAPI.get(`/customers?cpfCnpj=${cpfCnpj}`);
    if (search.data?.data?.length > 0) {
      customerId = search.data.data[0].id;
    }
  } catch (err) {
    console.warn("Erro ao buscar cliente por CPF, tentando criar novo...");
  }

  if (!customerId) {
    const customerResponse = await asaasAPI.post("/customers", {
      name,
      cpfCnpj,
      email,
      mobilePhone: phone || "",
    });
    customerId = customerResponse.data.id;
  }

  // Grava no banco de dados como pendente
  await syncAthleteToSupabase({ name, email, asaasId: customerId });

  return customerId;
}

// 1. Rota de teste
app.get("/ping", (req, res) => {
  res.json({ message: "Servidor Manguezal V2 com Lojinha!" });
});

// 1.5 Rota do Dashboard para a tela /direcao
app.get("/api/dashboard", async (req, res) => {
  try {
    const { data: athletes, error: errAthletes } = await supabase.from("athletes").select("*");
    const { data: payments, error: errPayments } = await supabase.from("payments").select("*").order("paid_at", { ascending: false });

    if (errAthletes || errPayments) throw new Error("Erro nas tabelas do Supabase");

    res.json({ athletes: athletes || [], payments: payments || [] });
  } catch (error) {
    console.error("Erro ao buscar dashboard:", error);
    res.status(500).json({ error: "Erro ao buscar dados do dashboard" });
  }
});

// 2. Rota PIX Avulso
app.post("/api/criar-pix", async (req, res) => {
  try {
    const { name, cpfCnpj, email, phone, value, description } = req.body;
    const customerId = await getOrCreateCustomer({ name, cpfCnpj, email, phone });

    const today = new Date().toISOString().split("T")[0];
    const paymentResponse = await asaasAPI.post("/payments", {
      customer: customerId,
      billingType: "PIX",
      value,
      dueDate: today,
      description: description || "Pagamento Manguezal",
    });

    const paymentId = paymentResponse.data.id;
    const pixResponse = await asaasAPI.get(`/payments/${paymentId}/pixQrCode`);

    return res.json({
      paymentId,
      encodedImage: pixResponse.data.encodedImage,
      payload: pixResponse.data.payload,
    });
  } catch (error) {
    console.error("Erro ao gerar PIX:", error.response?.data || error.message);
    return res.status(500).json({
      error: error.response?.data?.errors?.[0]?.description || "Falha ao gerar cobrança PIX.",
    });
  }
});

// 3. Rota Cartão Avulso
app.post("/api/criar-cartao", async (req, res) => {
  try {
    const { name, cpfCnpj, email, phone, value, description, creditCard, creditCardHolderInfo } = req.body;
    const customerId = await getOrCreateCustomer({ name, cpfCnpj, email, phone });

    const today = new Date().toISOString().split("T")[0];
    const paymentResponse = await asaasAPI.post("/payments", {
      customer: customerId,
      billingType: "CREDIT_CARD",
      value,
      dueDate: today,
      description: description || "Pagamento Manguezal",
      creditCard,
      creditCardHolderInfo,
    });

    return res.json({
      paymentId: paymentResponse.data.id,
      status: paymentResponse.data.status,
    });
  } catch (error) {
    console.error("Erro no cartão:", error.response?.data || error.message);
    return res.status(500).json({
      error: error.response?.data?.errors?.[0]?.description || "Falha ao processar cartão de crédito.",
    });
  }
});

// 4. Rota Assinatura
app.post("/api/criar-assinatura", async (req, res) => {
  try {
    const { name, cpfCnpj, email, phone, value, cycle, billingType, creditCard, creditCardHolderInfo } = req.body;
    const customerId = await getOrCreateCustomer({ name, cpfCnpj, email, phone });

    const today = new Date().toISOString().split("T")[0];
    const subData = {
      customer: customerId,
      billingType: billingType || "CREDIT_CARD",
      value,
      nextDueDate: today,
      cycle: cycle || "MONTHLY",
      description: "Associação Atlética Manguezal",
    };

    if (billingType === "CREDIT_CARD") {
      subData.creditCard = creditCard;
      subData.creditCardHolderInfo = creditCardHolderInfo;
    }

    const subResponse = await asaasAPI.post("/subscriptions", subData);
    const subscriptionId = subResponse.data.id;

    if (billingType === "PIX") {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const paymentsResponse = await asaasAPI.get(`/subscriptions/${subscriptionId}/payments`);
      const firstPayment = paymentsResponse.data.data?.[0];

      if (firstPayment) {
        const pixResponse = await asaasAPI.get(`/payments/${firstPayment.id}/pixQrCode`);
        return res.json({
          subscriptionId,
          paymentId: firstPayment.id,
          encodedImage: pixResponse.data.encodedImage,
          payload: pixResponse.data.payload,
          billingType: "PIX",
        });
      }
    }

    return res.json({
      subscriptionId,
      status: subResponse.data.status || "ACTIVE",
      billingType,
    });
  } catch (error) {
    console.error("Erro na assinatura:", error.response?.data || error.message);
    return res.status(500).json({
      error: error.response?.data?.errors?.[0]?.description || "Falha ao criar assinatura.",
    });
  }
});

// ==========================================
// 5. NOVA ROTA: Checkout da Lojinha
// ==========================================
app.post("/api/checkout-loja", async (req, res) => {
  try {
    const { 
      customer, 
      paymentMethod, 
      cardData, 
      cartItems, 
      hasSocioItems, 
      totalValue, 
      description 
    } = req.body;

    console.log(`Recebendo pedido da lojinha: ${customer.name}, Turma: ${customer.turma}, Valor: R$ ${totalValue}`);

    // Validação de Sócio (busca no Supabase pelo email)
    if (hasSocioItems) {
      const { data: athlete } = await supabase
        .from("athletes")
        .select("association_status")
        .eq("email", customer.email)
        .single();

      if (!athlete || athlete.association_status !== "active") {
        return res.status(400).json({ 
          isSocioError: true, 
          error: "O e-mail informado não consta como sócio ativo na nossa base. Use o mesmo e-mail do seu cadastro." 
        });
      }
    }

    // Cria ou busca o cliente no Asaas
    const customerId = await getOrCreateCustomer({ 
      name: customer.name, 
      cpfCnpj: customer.cpfCnpj, 
      email: customer.email, 
      phone: "" // Telefone não é obrigatório no form da loja
    });

    const today = new Date().toISOString().split("T")[0];

    // Processamento via PIX
    if (paymentMethod === "pix") {
      const paymentResponse = await asaasAPI.post("/payments", {
        customer: customerId,
        billingType: "PIX",
        value: totalValue,
        dueDate: today,
        description: description,
      });

      const paymentId = paymentResponse.data.id;
      const pixResponse = await asaasAPI.get(`/payments/${paymentId}/pixQrCode`);

      return res.json({
        paymentId,
        encodedImage: pixResponse.data.encodedImage,
        payload: pixResponse.data.payload,
      });

    // Processamento via Cartão de Crédito
    } else if (paymentMethod === "credit_card") {
      const paymentResponse = await asaasAPI.post("/payments", {
        customer: customerId,
        billingType: "CREDIT_CARD",
        value: totalValue,
        dueDate: today,
        description: description,
        creditCard: cardData?.creditCard, 
        creditCardHolderInfo: cardData?.creditCardHolderInfo
      });

      return res.json({ 
        success: true, 
        paymentId: paymentResponse.data.id,
        message: "Pagamento aprovado com sucesso!" 
      });
    } else {
      return res.status(400).json({ error: "Método de pagamento inválido." });
    }

  } catch (error) {
    console.error("Erro na rota /api/checkout-loja:", error.response?.data || error.message);
    return res.status(500).json({ 
      error: error.response?.data?.errors?.[0]?.description || "Erro interno no servidor ao processar o pagamento." 
    });
  }
});

// 6. Webhook com Persistência
app.post("/webhook/asaas", async (req, res) => {
  const evento = req.body;
  console.log("Notificação do Asaas recebida:", evento.event);

  if (evento.event === "PAYMENT_RECEIVED" || evento.event === "PAYMENT_CONFIRMED") {
    const pagamento = evento.payment;
    const asaasCustomerId = pagamento.customer;

    try {
      // 1. Atualiza status do atleta
      await supabase
        .from("athletes")
        .update({ association_status: "active" })
        .eq("asaas_customer_id", asaasCustomerId);

      // 2. Busca o nome do atleta para salvar no histórico
      const { data: athlete } = await supabase
        .from("athletes")
        .select("id, name")
        .eq("asaas_customer_id", asaasCustomerId)
        .single();

      // 3. Salva o pagamento
      await supabase.from("payments").insert([{
        athlete_id: athlete?.id,
        user_name: athlete?.name || "Desconhecido",
        payment_type: pagamento.description && pagamento.description.includes("Avulso") ? "single_training" : "monthly", 
        amount_cents: Math.round(pagamento.value * 100),
        payment_method: pagamento.billingType.toLowerCase(),
        status: "confirmed",
        paid_at: new Date().toISOString().split("T")[0],
        asaas_payment_id: pagamento.id
      }]);

      console.log(`✅ Pagamento Salvo no Banco! Valor: R$ ${pagamento.value}`);
    } catch (dbError) {
      console.error("Erro ao salvar webhook no banco:", dbError.message);
    }
  }

  res.status(200).send("OK");
});

// Garantia: Qualquer rota desconhecida devolve JSON
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada no servidor." });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 VAI RENDER PELO AMOR DE DEUS! Porta: ${PORT}`);
});