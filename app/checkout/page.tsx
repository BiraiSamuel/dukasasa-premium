"use client";
import { SectionTitle, IntaSendModal } from "@/components";
import { useProductStore } from "../_zustand/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const RedirectingModal = ({
  onClose,
  redirectUrl,
}: {
  onClose: () => void;
  redirectUrl: string;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg text-center shadow-xl max-w-sm w-full">
      <h2 className="text-lg font-semibold mb-2">Redirecting to IntaSend...</h2>
      <p className="text-sm text-gray-600 mb-4">
        You&#39;ll be taken to a secure payment page shortly.
      </p>
      <img
        src="https://intasend-prod-static.s3.amazonaws.com/img/trust-badges/intasend-trust-badge-with-mpesa-hr-dark.png"
        alt="Secure with IntaSend"
        className="mx-auto mb-2"
        width={250}
      />

      <div className="text-xs text-gray-500 mt-2">
        If the page doesn&#39;t open,{" "}
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          click here
        </a>{" "}
        to continue to IntaSend.
      </div>

      <button
        onClick={onClose}
        className="mt-4 text-blue-600 text-sm underline hover:text-blue-800"
      >
        Cancel
      </button>
    </div>
  </div>
);

const CheckoutPage = () => {
  const { clearCart } = useProductStore();
  const router = useRouter();

  const [cartData, setCartData] = useState<any>(null);
  const [shippingMethods, setShippingMethods] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("intasendcardmobilemoney");
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    lastname: "",
    phone: "",
    email: "",
    adress: "",
    city: "",
    country: "",
    postalCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutLink, setCheckoutLink] = useState<string | null>(null);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/proxy/cart", { cache: "no-store" });
        const json = await res.json();
        if (json.success) {
          setCartData(json.cart.data);
          if (!json.cart.data.items.length) {
            toast.error("Your cart is empty");
            router.push("/cart");
          }
        } else {
          throw new Error(json.message);
        }
      } catch (err: any) {
        toast.error("Failed to load cart: " + err.message);
        router.push("/cart");
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    if (!cartData) return;
    (async () => {
      try {
        const [shipRes, payRes] = await Promise.all([
          fetch("/api/proxy/cart/save/shipping-methods"),
          fetch("/api/proxy/cart/save/payment-methods"),
        ]);

        const shipData = await shipRes.json();
        const payData = await payRes.json();

        const fallbackShipping = [
          { method: "freeshipping_freeshipping", method_title: "Regular Shipping (Free)" },
          { method: "flatrate_flatrate", method_title: "Priority Shipping (+KES 150)" },
        ];
        const fallbackPayment = [
          { method: "intasendcardmobilemoney", method_title: "IntaSend Checkout (Mpesa, Visa, Mastercard)" },
        ];

        setShippingMethods(shipData.data?.length ? shipData.data : fallbackShipping);
        setPaymentMethods(payData.data?.length ? payData.data : fallbackPayment);
        setSelectedShipping(shipData.data?.[0]?.method || fallbackShipping[0].method);
        setSelectedPayment("intasendcardmobilemoney");
      } catch {
        toast.error("Failed to get shipping/payment options. Using defaults.");
        const fallbackShipping = [
          { method: "freeshipping_freeshipping", method_title: "Regular Shipping (Free)" },
          { method: "flatrate_flatrate", method_title: "Priority Shipping (+KES 150)" },
        ];
        const fallbackPayment = [
          { method: "intasendcardmobilemoney", method_title: "IntaSend Checkout (Mpesa, Visa, Mastercard)" },
        ];
        setShippingMethods(fallbackShipping);
        setPaymentMethods(fallbackPayment);
        setSelectedShipping(fallbackShipping[0].method);
        setSelectedPayment("intasendcardmobilemoney");
      }
    })();
  }, [cartData]);

  const makePurchase = async () => {
    if (isLoading) return;

    const { name, lastname, email, phone, adress, city, country, postalCode } = checkoutForm;
    if (![name, lastname, phone, email, adress, city, country, postalCode].every(Boolean)) {
      return toast.error("Please fill all required fields");
    }

    setIsLoading(true);
    try {
      const steps = await Promise.all([
        fetch("/api/proxy/cart/save-address", {
          method: "POST",
          body: JSON.stringify({
            billing: {
              first_name: name,
              last_name: lastname,
              email,
              address1: { 0: adress+"---"+city }, // ✅ Required field
              city,
              country,
              state: 'ke',
              postcode: postalCode,
              phone,
              use_for_shipping: "true",
            },
            shipping: {
              address1: { 0: adress+"---"+city } // ✅ Required even if use_for_shipping is true
            },
          }),
        }),
        fetch("/api/proxy/cart/save-shipping", {
          method: "POST",
          body: JSON.stringify({
            shipping_method:
              selectedShipping === "flatrate_flatrate"
                ? "flatrate_flatrate"
                : "free_free",
          }),
        }),
        fetch("/api/proxy/cart/save-payment", {
          method: "POST",
          body: JSON.stringify({ payment: { method: "intasendcardmobilemoney" } }),
        }),
      ]);
      
      console.log(steps);
      for (const res of steps) {
        const json = await res.json();
        console.log(json);
        //if (!json.ok) throw new Error(json.message);
      }
      console.log('got here')

      
      const orderRes = await fetch("/api/proxy/cart/checkout", { method: "POST" });
      const orderJson = await orderRes.json();

      //if (!orderJson.success) {  throw new Error(orderJson.message || "Checkout failed");}

      console.log("Order JSON:", orderJson);

      // Try to get data from orderJson, fallback to cartData
      const orderId = orderJson.data?.id || cartData?.id;
      const rawAmount = orderJson.data?.grand_total || cartData?.grand_total;

      if (!orderId || !rawAmount) {
        throw new Error("Missing order ID or amount");
      }
      const amount = parseFloat(rawAmount).toFixed(2);

      console.log("Order ID:", orderId);
      console.log("Amount:", amount);

      // proceed with orderId and amount...

      const checkoutRes = await fetch("/api/intasend/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${name} ${lastname}`,
          email,
          phone,
          amount,
          orderId,
        }),
      });

      const checkoutJson = await checkoutRes.json();
      //if (!checkoutJson.success) throw new Error(checkoutJson.error);

      toast.success("STK push sent to your phone.");
      setRedirectUrl(orderJson.redirect_url); // Add this
      setShowRedirectModal(true);
      console.log(checkoutJson);

      setTimeout(() => {
        window.open(orderJson.redirect_url, "_blank");
        //router.push(`/receipt?order_id=${orderId}`);
      }, 2000);
    } catch (err: any) {
      toast.error("Payment error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-8">
      <SectionTitle title="Checkout" path="Home | Cart | Checkout" />

      {!cartData && (
        <div className="flex flex-col items-center justify-center mt-8 animate-fade-in text-gray-700">
          <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8z" />
          </svg>
          <p className="text-sm text-gray-600">Loading your cart...</p>
        </div>
      )}

      {cartData && (
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-12 px-4 mt-10">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <ul className="divide-y divide-gray-200">
              {cartData.items.map((i: any) => (
                <li key={i.id} className="flex items-center py-4">
                  <Image src={i.product.base_image.medium_image_url} width={60} height={60} alt={i.name} />
                  <div className="ml-4 flex-grow">
                    <p className="font-medium">{i.name}</p>
                    <p className="text-gray-500">x{i.quantity}</p>
                  </div>
                  <div>KES.{i.price}</div>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right">
              <p><strong>Subtotal:</strong> {cartData.formated_sub_total}</p>
              <p><strong>Tax:</strong> {cartData.formated_tax_total}</p>
              <p><strong>Total:</strong> {cartData.formated_grand_total}</p>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-4">
              {["name", "lastname", "phone", "email", "adress", "city", "country", "postalCode"].map(f => (
                <input
                  key={f}
                  type="text"
                  placeholder={f}
                  className="p-2 border rounded"
                  value={(checkoutForm as any)[f]}
                  onChange={e => setCheckoutForm(prev => ({ ...prev, [f]: e.target.value }))}
                />
              ))}
            </div>

            <select
              value={selectedShipping}
              onChange={e => setSelectedShipping(e.target.value)}
              className="mt-4 w-full p-2 border rounded"
            >
              {shippingMethods.map(m => (
                <option key={m.method} value={m.method}>{m.method_title}</option>
              ))}
            </select>

            <select
              value={selectedPayment}
              disabled
              className="mt-4 w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            >
              <option value="intasendcardmobilemoney">IntaSend Checkout (Mpesa, Visa, Mastercard)</option>
            </select>

            <button
              onClick={makePurchase}
              disabled={isLoading}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Processing…" : "Pay Now"}
            </button>

            <div className="mt-6">
              <a href="https://intasend.com/security" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://intasend-prod-static.s3.amazonaws.com/img/trust-badges/intasend-trust-badge-with-mpesa-hr-dark.png"
                  width="300"
                  alt="IntaSend Secure Payments"
                  className="mx-auto"
                />
              </a>
              <a
                href="https://intasend.com/security"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs mt-2 text-gray-500 hover:underline text-center"
              >
                Secured by IntaSend Payments
              </a>
            </div>
          </div>
        </div>
      )}

      {checkoutLink && <IntaSendModal link={checkoutLink} onClose={() => setCheckoutLink(null)} />}
      {showRedirectModal && redirectUrl && (
        <RedirectingModal
          onClose={() => setShowRedirectModal(false)}
          redirectUrl={redirectUrl}
        />
      )}

    </div>
  );
};

export default CheckoutPage;
