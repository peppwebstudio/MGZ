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

// 2. Rota para gerar a cobrança PIX
app.post("/api/criar-pix", async (req, res) => {
  try {
    const { name, cpfCnpj, email, value, description } = req.body;

    // Criar ou buscar cliente no Asaas
    const customerResponse = await asaasAPI.post("/customers", {
      name,
      cpfCnpj,
      email,
    });
    const customerId = customerResponse.data.id;

    // Criar a cobrança PIX com vencimento para hoje
    const today = new Date().toISOString().split("T")[0];
    const paymentResponse = await asaasAPI.post("/payments", {
      customer: customerId,
      billingType: "PIX",
      value,
      dueDate: today,
      description: description || "Pagamento Manguezal",
    });
    const paymentId = paymentResponse.data.id;

    // Buscar o QR Code e a chave copia e cola do PIX
    const pixResponse = await asaasAPI.get(`/payments/${paymentId}/pixQrCode`);

    return res.json({
      paymentId: paymentId,
      encodedImage: pixResponse.data.encodedImage, // Imagem Base64 do QR Code
      payload: pixResponse.data.payload,           // Chave PIX Copia e Cola
    });
  } catch (error) {
    console.error("Erro ao gerar PIX:", error.response?.data || error.message);
    return res.status(500).json({ error: "Falha ao gerar cobrança PIX" });
  }
});

// 3. Rota do Webhook do Asaas (Recebe confirmações em tempo real)
app.post("/webhook/asaas", (req, res) => {
  const evento = req.body;
  console.log("Notificação do Asaas recebida:", evento.event);

  if (evento.event === "PAYMENT_RECEIVED" || evento.event === "PAYMENT_CONFIRMED") {
    const pagamento = evento.payment;
    console.log(`✅ Pagamento Aprovado! Valor: R$ ${pagamento.value} | ID: ${pagamento.id}`);
    // Aqui entra a lógica futura para atualizar status no banco de dados
  }

  res.status(200).send("OK");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});