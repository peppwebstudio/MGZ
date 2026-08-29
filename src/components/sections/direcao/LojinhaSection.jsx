import { ShoppingBag, Tag, Package, ShoppingCart, Eye } from "lucide-react";
import { formatBRL } from "./data";

export default function LojinhaSection({ storeOrders = [], onOpenModal }) {
  
  // 1. Pega EXCLUSIVAMENTE os pedidos que estão com status "confirmed" no Supabase
  const confirmedOrders = storeOrders.filter(order => order.status === "confirmed");

  // 2. Transforma os dados brutos de pedidos em uma lista agrupada por produtos
  const productsMap = {};

  confirmedOrders.forEach((order) => {
    const items = order.store_order_items || [];
    
    items.forEach((item) => {
      // Agrupa usando o ID do produto ou o nome (caso o ID seja nulo)
      const prodKey = item.product_id || item.product_name;

      if (!productsMap[prodKey]) {
        productsMap[prodKey] = {
          id: prodKey,
          name: item.product_name,
          unit_price_cents: item.unit_price_cents,
          // Como o BD de transações não salva a foto, deixamos vazia para usar o placeholder
          image: null, 
          buyers: []
        };
      }

      // Adiciona as informações reais do comprador que vieram do Supabase
      productsMap[prodKey].buyers.push({
        order_id: order.id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_turma: order.customer_turma,
        quantity: item.quantity,
        total_cents: Number(item.quantity) * Number(item.unit_price_cents),
        date: order.created_at
      });
    });
  });

  // Converte o nosso mapa agrupado em um Array para mapear na tela
  const storeProducts = Object.values(productsMap);

  // 3. Cálculo do faturamento total com Number() blindado (baseado nos dados reais)
  const storeTotalRevenue = storeProducts.reduce((acc, product) => {
    const buyers = product.buyers || [];
    return acc + buyers.reduce((bAcc, buyer) => bAcc + Number(buyer.total_cents || 0), 0);
  }, 0);

  // 4. Cálculo total de unidades vendidas blindado com Number()
  const storeTotalItemsSold = storeProducts.reduce((acc, product) => {
    const buyers = product.buyers || [];
    return acc + buyers.reduce((bAcc, buyer) => bAcc + Number(buyer.quantity || 0), 0);
  }, 0);

  return (
    <section className="pt-4 border-t border-neutral-800">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="w-7 h-7 text-[#ea580c]" />
        <h2 className="text-3xl font-bold text-[#ea580c]">Vendas da Lojinha</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Tag className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{formatBRL(storeTotalRevenue)}</div>
            <div className="text-xs text-neutral-400">Faturamento Total Geral (Lojinha)</div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{storeTotalItemsSold} unidades</div>
            <div className="text-xs text-neutral-400">Total de Itens Vendidos</div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-neutral-400" /> Desempenho por Produto
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-neutral-800 text-neutral-400">
                <th className="pb-3 font-medium">Produto</th>
                <th className="pb-3 font-medium text-center">Qtd. Vendida</th>
                <th className="pb-3 font-medium">Faturamento Total</th>
                <th className="pb-3 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {storeProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-neutral-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShoppingBag className="w-8 h-8 text-neutral-700" />
                      <p>Nenhuma venda confirmada registrada na lojinha ainda.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                storeProducts.map((product) => {
                  const buyers = product.buyers || [];
                  
                  const productQty = buyers.reduce((acc, b) => acc + Number(b.quantity || 0), 0);
                  const productRevenue = buyers.reduce((acc, b) => acc + Number(b.total_cents || 0), 0);

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-neutral-800/60 last:border-0 hover:bg-neutral-800/30 transition-colors group cursor-pointer"
                      onClick={() => onOpenModal && onOpenModal("store_buyers", product)}
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image || "https://placehold.co/150x150/1a1a1a/666666?text=Sem+Imagem"}
                            alt={product.name}
                            className="w-11 h-11 rounded-lg object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-white group-hover:text-[#ea580c] transition-colors">
                              {product.name}
                            </p>
                            <p className="text-xs text-neutral-400">
                              Preço Un.: {formatBRL(Number(product.unit_price_cents || 0))}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <span className="bg-neutral-800 text-neutral-200 text-xs font-semibold px-2.5 py-1 rounded-md border border-neutral-700">
                          {productQty}x
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-emerald-400">
                        {formatBRL(productRevenue)}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenModal) onOpenModal("store_buyers", product);
                          }}
                          className="inline-flex items-center gap-1.5 bg-neutral-800 hover:bg-[#ea580c] text-neutral-300 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-neutral-700 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" /> Quem Comprou
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}