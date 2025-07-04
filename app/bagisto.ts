export async function bagistoAddToCart(productId: number, token: string) {
  const res = await fetch("https://jezkimhardware.dukasasa.co.ke/api/checkout/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      product_id: productId,
      quantity: 1,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Add to cart failed");
  return data;
}

export async function bagistoAddToWishlist(productId: number, token: string) {
  const res = await fetch("https://jezkimhardware.dukasasa.co.ke/api/customer/wishlist/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id: productId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Add to wishlist failed");
  return data;
}

export async function bagistoGetWishlist(token: string) {
  const res = await fetch("https://jezkimhardware.dukasasa.co.ke/api/customer/wishlist", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch wishlist");
  }

  const data = await res.json();
  return data.data; // assuming wishlist items are inside `data.data`
}

export async function bagistoRemoveFromWishlist(productId: string, token: string) {
  const res = await fetch(
    `https://jezkimhardware.dukasasa.co.ke/api/customer/wishlist/remove/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) throw new Error("Failed to remove item from wishlist");
}