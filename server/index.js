const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const supabase = createClient("https://lozwywqilfwpeblhexwn.supabase.co", "sb_publishable_gASzFHrrR6bjdgq11oiUUw_vEZs67is");
const asaasAPI = axios.create({
  baseURL: process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3",
  headers: { access_token: process.env.ASAAS_API_KEY }
});

async function syncAthleteToSupabase({ name, email, cpf, asaasId }) {
  try {
    const cleanCpf = cpf ? cpf.replace(/\D/g, "") : null;
    const { data: ext } = await supabase.from("athletes").select("id").eq("email", email).maybeSingle();
    if (!ext) {
      await supabase.from("athletes").insert([{ name, email, cpf: cleanCpf, asaas_customer_id: asaasId, association_status: "pending" }]);
    } else {
      await supabase.from("athletes").update({ asaas_customer_id: asaasId, ...(cleanCpf && { cpf: cleanCpf }) }).eq("id", ext.id);
    }
  } catch (e) {}
}

async function getOrCreateCustomer({ name, cpfCnpj, email, phone }) {
  let id = null;
  const cleanCpf = cpfCnpj ? cpfCnpj.replace(/\D/g, "") : "";
  try {
    const search = await asaasAPI.get(`/customers?cpfCnpj=${cleanCpf}`);
    if (search.data?.data?.length > 0) id = search.data.data[0].id;
  } catch (e) {}
  if (!id) {
    const res = await asaasAPI.post("/customers", { name, cpfCnpj: cleanCpf, email, mobilePhone: phone || "" });
    id = res.data.id;
  }
  await syncAthleteToSupabase({ name, email, cpf: cleanCpf, asaasId: id });
  return id;
}

app.get("/ping", (req, res) => res.json({ message: "Servidor Manguezal V2 com Lojinha!" }));

app.get("/api/dashboard", async (req, res) => {
  try {
    const [ath, pay, ord] = await Promise.all([
      supabase.from("athletes").select("*"),
      supabase.from("payments").select("*").order("paid_at", { ascending: false }),
      supabase.from("store_orders").select("*, store_order_items(*)").order("created_at", { ascending: false })
    ]);
    res.json({ athletes: ath.data || [], payments: pay.data || [], storeOrders: ord.data || [] });
  } catch (e) { res.status(500).json({ error: "Erro no dashboard" }); }
});

app.post("/api/criar-pix", async (req, res) => {
  try {
    const { name, cpfCnpj, email, phone, value, description } = req.body;
    const customer = await getOrCreateCustomer({ name, cpfCnpj, email, phone });
    const pay = await asaasAPI.post("/payments", { customer, billingType: "PIX", value, dueDate: new Date().toISOString().split("T")[0], description: description || "Pagamento Manguezal" });
    const pix = await asaasAPI.get(`/payments/${pay.data.id}/pixQrCode`);
    res.json({ paymentId: pay.data.id, encodedImage: pix.data.encodedImage, payload: pix.data.payload });
  } catch (e) { res.status(500).json({ error: e.response?.data?.errors?.[0]?.description || "Falha PIX" }); }
});

app.post("/api/criar-cartao", async (req, res) => {
  try {
    const { name, cpfCnpj, email, phone, value, description, creditCard, creditCardHolderInfo } = req.body;
    const customer = await getOrCreateCustomer({ name, cpfCnpj, email, phone });
    const pay = await asaasAPI.post("/payments", { customer, billingType: "CREDIT_CARD", value, dueDate: new Date().toISOString().split("T")[0], description: description || "Pagamento Manguezal", creditCard, creditCardHolderInfo });
    res.json({ paymentId: pay.data.id, status: pay.data.status });
  } catch (e) { res.status(500).json({ error: e.response?.data?.errors?.[0]?.description || "Falha Cartão" }); }
});

app.post("/api/criar-assinatura", async (req, res) => {
  try {
    const { name, cpfCnpj, email, phone, value, cycle, billingType, creditCard, creditCardHolderInfo } = req.body;
    const customer = await getOrCreateCustomer({ name, cpfCnpj, email, phone });
    const subData = { customer, billingType: billingType || "CREDIT_CARD", value, nextDueDate: new Date().toISOString().split("T")[0], cycle: cycle || "MONTHLY", description: "Associação Atlética Manguezal" };
    if (billingType === "CREDIT_CARD") { subData.creditCard = creditCard; subData.creditCardHolderInfo = creditCardHolderInfo; }
    const sub = await asaasAPI.post("/subscriptions", subData);
    if (billingType === "PIX") {
      await new Promise(r => setTimeout(r, 1500));
      const pays = await asaasAPI.get(`/subscriptions/${sub.data.id}/payments`);
      if (pays.data.data?.[0]) {
        const pix = await asaasAPI.get(`/payments/${pays.data.data[0].id}/pixQrCode`);
        return res.json({ subscriptionId: sub.data.id, paymentId: pays.data.data[0].id, encodedImage: pix.data.encodedImage, payload: pix.data.payload, billingType: "PIX" });
      }
    }
    res.json({ subscriptionId: sub.data.id, status: sub.data.status || "ACTIVE", billingType });
  } catch (e) { res.status(500).json({ error: e.response?.data?.errors?.[0]?.description || "Falha Assinatura" }); }
});

app.post("/api/checkout-loja", async (req, res) => {
  try {
    const { customer, paymentMethod, cardData, cartItems = [], hasSocioItems, totalValue, description } = req.body;
    const cleanCpf = customer.cpfCnpj ? customer.cpfCnpj.replace(/\D/g, "") : "";
    
    if (hasSocioItems) {
      let ath = null;
      if (cleanCpf) ath = (await supabase.from("athletes").select("association_status").eq("cpf", cleanCpf).maybeSingle()).data;
      if (!ath && customer.email) ath = (await supabase.from("athletes").select("association_status").eq("email", customer.email).maybeSingle()).data;
      if (!ath || ath.association_status !== "active") return res.status(400).json({ isSocioError: true, error: "O CPF/E-mail informado não consta como sócio ativo." });
    }

    const customerId = await getOrCreateCustomer({ name: customer.name, cpfCnpj: cleanCpf, email: customer.email, phone: "" });
    const today = new Date().toISOString().split("T")[0];
    let payId, pixData = null, status = "pending";

    if (paymentMethod === "pix") {
      const pay = await asaasAPI.post("/payments", { customer: customerId, billingType: "PIX", value: totalValue, dueDate: today, description });
      payId = pay.data.id;
      pixData = (await asaasAPI.get(`/payments/${payId}/pixQrCode`)).data;
    } else if (paymentMethod === "credit_card") {
      const pay = await asaasAPI.post("/payments", { customer: customerId, billingType: "CREDIT_CARD", value: totalValue, dueDate: today, description, creditCard: cardData?.creditCard, creditCardHolderInfo: cardData?.creditCardHolderInfo });
      payId = pay.data.id;
      if (["CONFIRMED", "RECEIVED"].includes(pay.data.status)) status = "confirmed";
    } else {
      return res.status(400).json({ error: "Método inválido." });
    }

    const { data: order } = await supabase.from("store_orders").insert([{
      customer_name: customer.name, customer_cpf: cleanCpf, customer_email: customer.email, customer_turma: customer.turma,
      total_cents: Math.round(totalValue * 100), payment_method: paymentMethod, status, asaas_payment_id: payId
    }]).select("id").single();

    if (order && cartItems.length > 0) {
      await supabase.from("store_order_items").insert(cartItems.map(i => ({
        order_id: order.id, product_id: i.id || null, product_name: i.name || "Produto", quantity: i.quantity || 1, size: i.size || "Único",
        unit_price_cents: Math.round((i.price || 0) * 100), price_type: i.userType === "Sócio Atleta" ? "socio" : "geral"
      })));
    }

    if (paymentMethod === "pix") return res.json({ paymentId: payId, encodedImage: pixData.encodedImage, payload: pixData.payload });
    res.json({ success: true, paymentId: payId, message: "Aprovado!" });
  } catch (e) { res.status(500).json({ error: e.response?.data?.errors?.[0]?.description || "Erro no pagamento" }); }
});

app.post("/webhook/asaas", async (req, res) => {
  const ev = req.body;
  if (["PAYMENT_RECEIVED", "PAYMENT_CONFIRMED"].includes(ev.event)) {
    const pay = ev.payment, desc = pay.description || "";
    try {
      if (desc.includes("Lojinha")) {
        await supabase.from("store_orders").update({ status: "confirmed" }).eq("asaas_payment_id", pay.id);
      } else {
        await supabase.from("athletes").update({ association_status: "active" }).eq("asaas_customer_id", pay.customer);
        const { data: ath } = await supabase.from("athletes").select("id, name").eq("asaas_customer_id", pay.customer).maybeSingle();
        await supabase.from("payments").insert([{
          athlete_id: ath?.id || null, user_name: ath?.name || "Desconhecido", payment_type: desc.includes("Avulso") ? "single_training" : "monthly",
          amount_cents: Math.round(pay.value * 100), payment_method: pay.billingType.toLowerCase(), status: "confirmed",
          paid_at: new Date().toISOString().split("T")[0], asaas_payment_id: pay.id
        }]);
      }
    } catch (e) {}
  }
  res.status(200).send("OK");
});

app.use((req, res) => res.status(404).json({ error: "Rota não encontrada." }));
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 VAI RENDER! Porta: ${PORT}`));