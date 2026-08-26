import { useState } from "react";
import SiteHeader from "../components/site/SiteHeader";
import { PRODUCTS } from "../components/sections/loja/Produtos";

// Subcomponentes refatorados
import LojaBanner from "../components/sections/loja/LojaBanner";
import ProductCard from "../components/sections/loja/ProductCard";
import ProductModal from "../components/sections/loja/ProductModal";
import CartDrawer from "../components/sections/loja/CartDrawer";
import CheckoutModal from "../components/sections/loja/CheckoutModal";
import CartToast from "../components/sections/loja/CartToast";

const BACKEND_URL = "https://manguezal-backend.onrender.com";

export default function Loja() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedType, setSelectedType] = useState("socio");
  const [productTypes, setProductTypes] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // Estados do Checkout (PIX e Cartão)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  // Adicionado o campo turma vazio no estado inicial
  const [customer, setCustomer] = useState({ name: "", cpf: "", email: "", turma: "" });
  const [pixData, setPixData] = useState(null);
  
  // Novos estados para lidar com erros, validação de sócio e sucesso do cartão
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [isSocioError, setIsSocioError] = useState(false);
  const [cardSuccess, setCardSuccess] = useState(false);
  
  const [copied, setCopied] = useState(false);

  const getProductType = (productId) => productTypes[productId] || "socio";

  const handleTypeChange = (productId, type) => {
    setProductTypes((prev) => ({ ...prev, [productId]: type }));
  };

  const handleOpenProduct = (product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0]);
    setSelectedType(getProductType(product.id));
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const currentPrice =
      selectedType === "socio"
        ? selectedProduct.priceSocio
        : selectedProduct.priceNormal;
    const userTypeLabel = selectedType === "socio" ? "Sócio Atleta" : "Geral";

    const cartItem = {
      cartId: `${selectedProduct.id}-${selectedSize}-${selectedType}`,
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: currentPrice,
      userType: userTypeLabel,
      image: selectedProduct.image,
      size: selectedSize,
      quantity: quantity,
    };

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.cartId === cartItem.cartId
      );
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prevCart, cartItem];
    });

    setSelectedProduct(null);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const updateCartQuantity = (cartId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const totalCartValue = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    // Reseta todos os estados ao abrir o checkout
    setPixData(null);
    setCheckoutError("");
    setIsSocioError(false);
    setCardSuccess(false);
  };

  // Nova função unificada para processar PIX e Cartão
  const handleProcessPayment = async ({ paymentMethod, customer, cardData }) => {
    // Adicionada a validação para barrar se a turma não for preenchida
    if (!customer.name || !customer.cpf || !customer.email || !customer.turma) {
      setCheckoutError("Por favor, preencha todos os campos dos seus dados, incluindo a turma.");
      return;
    }

    // Verifica se existe algum item de "Sócio Atleta" no carrinho para o backend validar
    const hasSocioItems = cart.some((item) => item.userType === "Sócio Atleta");

    setLoadingPayment(true);
    setCheckoutError("");
    setIsSocioError(false);

    try {
      // Vamos apontar para uma nova rota unificada no backend
      const response = await fetch(`${BACKEND_URL}/api/checkout-loja`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: customer.name,
            cpfCnpj: customer.cpf.replace(/\D/g, ""),
            email: customer.email,
            turma: customer.turma, // Enviando a turma para o backend
          },
          paymentMethod, // "pix" ou "credit_card"
          cardData: paymentMethod === "credit_card" ? cardData : undefined,
          cartItems: cart,
          hasSocioItems,
          totalValue: totalCartValue,
          description: `Compra Lojinha Manguezal (${totalCartItems} itens)`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Se o backend nos avisar que o erro foi por causa da validação de sócio
        if (data.isSocioError) {
          setIsSocioError(true);
          setCheckoutError(data.error || "CPF não consta como sócio ativo.");
        } else {
          setCheckoutError(data.error || "Ocorreu um erro ao processar o pagamento.");
        }
        return;
      }

      // Se deu tudo certo
      if (paymentMethod === "pix" && data.encodedImage) {
        setPixData(data);
      } else if (paymentMethod === "credit_card") {
        setCardSuccess(true);
      }

    } catch (err) {
      console.error("Erro ao conectar ao backend:", err);
      setCheckoutError("Não foi possível conectar ao servidor de pagamentos.");
    } finally {
      setLoadingPayment(false);
    }
  };

  const handleCopyPix = () => {
    if (pixData?.payload) {
      navigator.clipboard.writeText(pixData.payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleCheckoutComplete = () => {
    setIsCheckoutOpen(false);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans">
      <SiteHeader />

      {/* Banner Principal */}
      <LojaBanner
        totalCartItems={totalCartItems}
        totalCartValue={totalCartValue}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Grid de Produtos */}
      <main className="max-w-7xl mx-auto px-4 py-10 flex-1 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {PRODUCTS.map((product) => {
            const currentType = getProductType(product.id);
            const currentPrice =
              currentType === "socio"
                ? product.priceSocio
                : product.priceNormal;

            return (
              <ProductCard
                key={product.id}
                product={product}
                currentType={currentType}
                currentPrice={currentPrice}
                onOpenProduct={handleOpenProduct}
                onTypeChange={handleTypeChange}
              />
            );
          })}
        </div>
      </main>

      {/* Pop-up do Produto */}
      <ProductModal
        product={selectedProduct}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        quantity={quantity}
        setQuantity={setQuantity}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Gaveta do Carrinho */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateCartQuantity={updateCartQuantity}
        removeFromCart={removeFromCart}
        totalCartValue={totalCartValue}
        onOpenCheckout={handleOpenCheckout}
      />

      {/* Modal de Checkout */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        customer={customer}
        setCustomer={setCustomer}
        pixData={pixData}
        cardSuccess={cardSuccess}
        loadingPayment={loadingPayment}
        checkoutError={checkoutError}
        isSocioError={isSocioError}
        copied={copied}
        onProcessPayment={handleProcessPayment}
        onCopyPix={handleCopyPix}
        onComplete={handleCheckoutComplete}
        totalCartValue={totalCartValue}
      />

      {/* Notificação Toast */}
      <CartToast show={addedToast} />

      {/* Footer */}
      <footer className="bg-black border-t border-neutral-800 py-8 px-4 text-center text-xs text-neutral-500 mt-auto">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-bold text-neutral-400">ATLETICA MANGUEZAL © 2026</p>
          <p>
            Todos os direitos reservados. Entregas nos dias e locais determinados previamente pela diretoria.
          </p>
        </div>
      </footer>
    </div>
  );
}