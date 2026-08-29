const API_BASE_URL = import.meta.env.VITE_API_URL || "https://manguezal-backend.onrender.com";

export const fetchAthletesFromDB = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard`);
    if (!response.ok) throw new Error("Falha ao buscar dados no servidor");
    
    const data = await response.json();
    
    return (data.athletes || []).map((athlete) => ({
      id: athlete.id,
      name: athlete.name || "Sem Nome",
      email: athlete.email,
      association_status: athlete.association_status || "pending",
      expires_at: athlete.expires_at || null,
      inactive_at: athlete.inactive_at || null,
    }));
  } catch (error) {
    console.error("Erro ao carregar atletas do banco:", error);
    return [];
  }
};


export const fetchPaymentsFromDB = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard`);
    if (!response.ok) throw new Error("Falha ao buscar pagamentos no servidor");
    
    const data = await response.json();

    return (data.payments || []).map((p) => ({
      id: p.id,
      athlete_id: p.athlete_id,
      user_name: p.user_name || "Atleta",
      payment_type: p.payment_type || "monthly",
      amount_cents: p.amount_cents || 0,
      payment_method: p.payment_method || "pix",
      status: p.status || "confirmed",
      paid_at: p.paid_at ? p.paid_at.split("T")[0] : null,
    }));
  } catch (error) {
    console.error("Erro ao carregar pagamentos do banco:", error);
    return [];
  }
};


export const fetchStoreProductsFromDB = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard`);
    if (!response.ok) throw new Error("Falha ao buscar pedidos da lojinha no servidor");
    
    const data = await response.json();
    
    return data.storeOrders || [];
  } catch (error) {
    console.error("Erro ao carregar pedidos da lojinha do banco:", error);
    return [];
  }
};