import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  updateCartQuantity,
  removeFromCart,
  totalCartValue,
  onOpenCheckout,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="bg-neutral-900 border-l border-neutral-800 w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-right duration-200">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#ea580c]" />
              <h3 className="text-lg font-bold text-white">Seu Carrinho</h3>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-3 overflow-y-auto max-h-[55vh] pr-1">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 space-y-2">
                <ShoppingCart className="w-12 h-12 mx-auto opacity-30" />
                <p className="text-sm">Seu carrinho está vazio.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartId}
                  className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-lg bg-neutral-900 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      Tam: <span className="text-neutral-200 font-bold">{item.size}</span> •{" "}
                      <span className="text-[#ea580c] font-semibold">{item.userType}</span>
                    </p>
                    <p className="text-xs font-bold text-[#ea580c] mt-0.5">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateCartQuantity(item.cartId, -1)}
                      className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold px-1">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.cartId, 1)}
                      className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="w-6 h-6 rounded text-red-400 hover:text-red-300 ml-1 flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {cart.length > 0 && (
          <div className="border-t border-neutral-800 pt-4 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span>R$ {totalCartValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Retirada no Treino</span>
                <span className="text-green-400 font-semibold">Grátis</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                <span>Total</span>
                <span className="text-[#ea580c] text-lg">
                  R$ {totalCartValue.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenCheckout}
              className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-[#ea580c]/20"
            >
              Ir para o Pagamento
            </button>
          </div>
        )}
      </div>
    </div>
  );
}