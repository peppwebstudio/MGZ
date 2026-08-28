const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Configuração Supabase
const supabaseUrl = "https://lozwywqilfwpeblhexwn.supabase.co";
const supabaseKey = "sb_publishable_gASzFHrrR6bjdgq11oiUUw_vEZs67is";
const supabase = createClient(supabaseUrl, supabaseKey);

const asaasAPI = axios.create({
  baseURL: process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3",
  headers: {
    access_token: process.env.ASAAS_API_KEY,
  },
});

// Helper: Sincroniza o cliente com o banco de dados (Supabase), incluindo CPF
async function syncAthleteToSupabase({ name, email, cpf, asaasId }) {
  try {
    const cleanCpf = cpf ? cpf.replace(/\D/g, "") : null;

    const { data: existingAthlete, error: fetchErr } = await supabase
      .from("athletes")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (fetchErr) {
      console.error("Aviso: Erro ao verificar atleta existente:", fetchErr.message);
      return;
    }

    if (!existingAthlete) {
      const { error: insertErr } = await supabase.from("athletes").insert([{
        name,
        email,
        cpf: cleanCpf,
        asaas_customer_id: asaasId,
        association_status: "pending"
      }]);
      
      if (insertErr) {
        console.error("Aviso: Erro ao inserir atleta no Supabase:", insertErr.message);
      }
    } else {
      const { error: updateErr } = await supabase
        .from("athletes")
        .update({ 
          asaas_customer_id: asaasId,
          ...(cleanCpf && { cpf: cleanCpf })
        })
        .eq("id", existingAthlete.id);
        
      if (updateErr) {
        console.error("Aviso: Erro ao atualizar atleta no Supabase:", updateErr.message);
      }
    }
  } catch (err) {
    console.error("Aviso: Erro inesperado ao sincronizar com Supabase:", err.message);
  }
}

// Helper: Busca cliente existente pelo CPF ou cria um novo
async function getOrCreateCustomer({ name, cpfCnpj, email, phone }) {
  let customerId = null;
  const cleanCpf = cpfCnpj ? cpfCnpj.replace(/\D/g, "") : "";
  
  try {
    const search = await asaasAPI.get(`/customers?cpfCnpj=${cleanCpf}`);
    if (search.data?.data?.length > 0) {
      customerId = search.data.data[0].id;
    }
  } catch (err) {
    console.warn("Erro ao buscar cliente por CPF, tentando criar novo...");
  }

  if (!customerId) {
    const customerResponse = await asaasAPI.post("/customers", {
      name,
      cpfCnpj: cleanCpf,
      email,
      mobilePhone: phone || "",
    });
    customerId = customerResponse.data.id;
  }

  // Grava no banco de dados como pendente
  await syncAthleteToSupabase({ name, email, cpf: cleanCpf, asaasId: customerId });

  return customerId;
}

// 1. Rota de teste
app.get("/ping", (req, res) => {
  res.json({ message: "Servidor Manguezal V2 com Lojinha!" });
});

// 1.5 Rota do Dashboard para a tela /direcao (Atletas, Pagamentos e Pedidos da Loja)
app.get("/api/dashboard", async (req, res) => {
  try {
    const { data: athletes, error: errAthletes } = await supabase.from("athletes").select("*");
    const { data: payments, error: errPayments } = await supabase.from("payments").select("*").order("paid_at", { ascending: false });
    const { data: storeOrders, error: errOrders } = await supabase.from("store_orders").select("*, store_order_items(*)").order("created_at", { ascending: false });

    if (errAthletes || errPayments || errOrders) throw new Error("Erro nas tabelas do Supabase");

    res.json({ 
      athletes: athletes || [], 
      payments: payments || [],
      storeOrders: storeOrders || []
    });
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
// 5. Checkout da Lojinha com Validação de CPF e Registro no Supabase
// ==========================================
app.post("/api/checkout-loja", async (req, res) => {
  try {
    const { 
      customer, 
      paymentMethod, 
      cardData, 
      cartItems = [], 
      hasSocioItems, 
      totalValue, 
      description 
    } = req.body;

    const cleanCpf = customer.cpfCnpj ? customer.cpfCnpj.replace(/\D/g, "") : "";

    console.log(`Recebendo pedido da lojinha: ${customer.name}, CPF: ${cleanCpf}, Valor: R$ ${totalValue}`);

    // Validação de Sócio por CPF (procura na base pelo CPF ou pelo Email)
    if (hasSocioItems) {
      let athlete = null;

      if (cleanCpf) {
        const { data: athleteByCpf } = await supabase
          .from("athletes")
          .select("association_status")
          .eq("cpf", cleanCpf)
          .maybeSingle();
        athlete = athleteByCpf;
      }

      if (!athlete && customer.email) {
        const { data: athleteByEmail } = await supabase
          .from("athletes")
          .select("association_status")
          .eq("email", customer.email)
          .maybeSingle();
        athlete = athleteByEmail;
      }

      if (!athlete || athlete.association_status !== "active") {
        return res.status(400).json({ 
          isSocioError: true, 
          error: "O CPF/E-mail informado não consta como sócio ativo na nossa base. regularize sua situação ou entre em contato." 
        });
      }
    }

    // Cria ou busca o cliente no Asaas
    const customerId = await getOrCreateCustomer({ 
      name: customer.name, 
      cpfCnpj: cleanCpf, 
      email: customer.email, 
      phone: ""
    });

    const today = new Date().toISOString().split("T")[0];
    let paymentId = null;
    let pixData = null;
    let initialStatus = "pending";

    // Processamento via PIX
    if (paymentMethod === "pix") {
      const paymentResponse = await asaasAPI.post("/payments", {
        customer: customerId,
        billingType: "PIX",
        value: totalValue,
        dueDate: today,
        description: description,
      });

      paymentId = paymentResponse.data.id;
      const pixResponse = await asaasAPI.get(`/payments/${paymentId}/pixQrCode`);
      pixData = pixResponse.data;

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

      paymentId = paymentResponse.data.id;
      if (paymentResponse.data.status === "CONFIRMED" || paymentResponse.data.status === "RECEIVED") {
        initialStatus = "confirmed";
      }
    } else {
      return res.status(400).json({ error: "Método de pagamento inválido." });
    }

    // Grava o pedido na tabela store_orders do Supabase
    const { data: orderData, error: orderErr } = await supabase
      .from("store_orders")
      .insert([{
        customer_name: customer.name,
        customer_cpf: cleanCpf,
        customer_email: customer.email,
        total_cents: Math.round(totalValue * 100),
        payment_method: paymentMethod,
        status: initialStatus,
        asaas_payment_id: paymentId
      }])
      .select("id")
      .single();

    if (orderErr) {
      console.error("Erro ao gravar pedido na loja (Supabase):", orderErr.message);
    } else if (orderData && cartItems.length > 0) {
      // Grava os itens do pedido com detalhes (tamanho, preço e modalidade)
      const orderItemsToInsert = cartItems.map((item) => ({
        order_id: orderData.id,
        product_id: item.id || null,
        product_name: item.name || "Produto",
        quantity: item.quantity || 1,
        size: item.size || "Único",
        unit_price_cents: Math.round((item.price || 0) * 100),
        price_type: item.isSocioPrice ? "socio" : "geral"
      }));

      const { error: itemsErr } = await supabase.from("store_order_items").insert(orderItemsToInsert);
      if (itemsErr) console.error("Erro ao gravar itens do pedido (Supabase):", itemsErr.message);
    }

    if (paymentMethod === "pix") {
      return res.json({
        paymentId,
        encodedImage: pixData.encodedImage,
        payload: pixData.payload,
      });
    } else {
      return res.json({ 
        success: true, 
        paymentId,
        message: "Pagamento aprovado com sucesso!" 
      });
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
      // 1. Atualiza compras da lojinha vinculadas a este pagamento
      const { error: storeErr } = await supabase
        .from("store_orders")
        .update({ status: "confirmed" })
        .eq("asaas_payment_id", pagamento.id);

      if (storeErr) console.error("Aviso ao atualizar pedido da loja no webhook:", storeErr.message);

      // 2. Atualiza status do atleta (Assinatura / Plano)
      const { error: updateErr } = await supabase
        .from("athletes")
        .update({ association_status: "active" })
        .eq("asaas_customer_id", asaasCustomerId);
        
      if (updateErr) console.error("Erro ao atualizar status do atleta (Webhook):", updateErr.message);

      // 3. Busca o nome do atleta para salvar no histórico de mensalidades
      const { data: athlete, error: athleteErr } = await supabase
        .from("athletes")
        .select("id, name")
        .eq("asaas_customer_id", asaasCustomerId)
        .maybeSingle();

      if (athleteErr) console.error("Erro ao buscar atleta (Webhook):", athleteErr.message);

      // 4. Salva o pagamento de mensalidade/avulso
      const { error: paymentErr } = await supabase.from("payments").insert([{
        athlete_id: athlete?.id || null,
        user_name: athlete?.name || "Desconhecido",
        payment_type: pagamento.description && pagamento.description.includes("Avulso") ? "single_training" : "monthly", 
        amount_cents: Math.round(pagamento.value * 100),
        payment_method: pagamento.billingType.toLowerCase(),
        status: "confirmed",
        paid_at: new Date().toISOString().split("T")[0],
        asaas_payment_id: pagamento.id
      }]);
      
      if (paymentErr) {
        console.error("Erro ao salvar histórico de pagamento (Webhook):", paymentErr.message);
      } else {
        console.log(`✅ Pagamento Salvo no Banco! Valor: R$ ${pagamento.value}`);
      }
    } catch (dbError) {
      console.error("Erro ao processar webhook no banco:", dbError.message);
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