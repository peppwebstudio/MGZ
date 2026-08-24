const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Configuração do Axios para comunicação com o Asaas
const asaasAPI = axios.create({
  baseURL: process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3",
  headers: {
    access_token: process.env.ASAAS_API_KEY,
  },
});

// 1. Rota de teste
app.get("/ping", (req, res) => {
  res.send("Servidor Manguezal rodando perfeitamente!");
});

// 2. Rota para gerar cobrança PIX avulsa
app.post("/api/criar-pix", async (req, res) => {
  try {
    const { name, cpfCnpj, email, phone, value, description } = req.body;

    // Criar ou buscar cliente no Asaas
    const customerResponse = await asaasAPI.post("/customers", {
      name,
      cpfCnpj,
      email,
      mobilePhone: phone,
    });
    const customerId = customerResponse.data.id;

    // Criar cobrança PIX
    const today = new Date().toISOString().split("T")[0];
    const paymentResponse = await asaasAPI.post("/payments", {
      customer: customerId,
      billingType: "PIX",
      value,
      dueDate: today,
      description: description || "Pagamento Manguezal",
    });
    const paymentId = paymentResponse.data.id;

    // Buscar QR Code e chave Copia e Cola
    const pixResponse = await asaasAPI.get(`/payments/${paymentId}/pixQrCode`);

    return res.json({
      paymentId: paymentId,
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

// 3. Rota para pagamento único no Cartão de Crédito
app.post("/api/criar-cartao", async (req, res) => {
  try {
    const { name, cpfCnpj, email, phone, value, description, creditCard, creditCardHolderInfo } = req.body;

    const customerResponse = await asaasAPI.post("/customers", {
      name,
      cpfCnpj,
      email,
      mobilePhone: phone,
    });
    const customerId = customerResponse.data.id;

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

// 4. Rota para criar Assinatura Recorrente (Mensal / Anual - PIX ou Cartão)
app.post("/api/criar-assinatura", async (req, res) => {
  try {
    const { name, cpfCnpj, email, phone, value, cycle, billingType, creditCard, creditCardHolderInfo } = req.body;

    const customerResponse = await asaasAPI.post("/customers", {
      name,
      cpfCnpj,
      email,
      mobilePhone: phone,
    });
    const customerId = customerResponse.data.id;

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

    // Se for assinatura no PIX, busca a 1ª cobrança para devolver o QR Code imediato
    if (billingType === "PIX") {
      await new Promise((resolve) => setTimeout(resolve, 1200));
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

// 5. Rota do Webhook do Asaas
app.post("/webhook/asaas", (req, res) => {
  const evento = req.body;
  console.log("Notificação do Asaas recebida:", evento.event);

  if (evento.event === "PAYMENT_RECEIVED" || evento.event === "PAYMENT_CONFIRMED") {
    const pagamento = evento.payment;
    console.log(`✅ Pagamento Aprovado! Valor: R$ ${pagamento.value} | ID: ${pagamento.id}`);
  }

  res.status(200).send("OK");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});