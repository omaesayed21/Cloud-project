
const API_URL = 'http://127.0.0.1:8000/api/accounts';

const getToken = () => {
  return localStorage.getItem('token');
};

export async function getWallets() {
  const res = await fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  if (!res.ok) throw new Error('Failed to fetch wallets');
  return await res.json();
}

export async function addWallet(wallet) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(wallet)
  });
  if (!res.ok) throw new Error('Failed to add wallet');
  return await res.json();
}

export async function updateWallet(wallet) {
  const res = await fetch(`${API_URL}/${wallet.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(wallet)
  });
  if (!res.ok) throw new Error('Failed to update wallet');
  return await res.json();
}

export async function deleteWallet(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  if (!res.ok) throw new Error('Failed to delete wallet');
}
