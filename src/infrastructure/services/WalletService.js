const API_URL = "http://127.0.0.1:8000/api/accounts";

const getToken = () => {
  return localStorage.getItem("token");
};

export async function getWallets() {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch wallets");
  return await res.json();
}

export async function addWallet(wallet) {
  console.log("Sending wallet data:", wallet);

  try {
    // Sanitize wallet data and ensure type is lowercase
    const sanitizedWallet = {
      name: wallet.name || "",
      balance: Number(wallet.balance) || 0,
      type: (wallet.type || "cash").toLowerCase(), // Convert type to lowercase
      currency: wallet.currency || "EGP",
      notes: wallet.notes || "",
    };

    console.log("Sanitized wallet data:", sanitizedWallet);

    const res = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(sanitizedWallet),
      credentials: "include",
      mode: "cors",
      redirect: "error",
    });

    console.log("Response status:", res.status);
    console.log("Response headers:", [...res.headers.entries()]);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Full error response:", errorText);
      throw new Error(errorText || "Failed to add wallet");
    }

    return await res.json();
  } catch (error) {
    console.error("Full error:", error);
    throw error;
  }
}

export async function updateWallet(wallet) {
  const res = await fetch(`${API_URL}/${wallet.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${getToken()}`,
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify({
      ...wallet,
      type: wallet.type.toLowerCase(), // Convert type to lowercase
    }),
    credentials: "include",
    mode: "cors",
    redirect: "error",
  });
  if (!res.ok) throw new Error("Failed to update wallet");
  return await res.json();
}

export async function deleteWallet(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getToken()}`,
      "X-Requested-With": "XMLHttpRequest",
    },
    credentials: "include",
    mode: "cors",
    redirect: "error",
  });
  if (!res.ok) throw new Error("Failed to delete wallet");
}
