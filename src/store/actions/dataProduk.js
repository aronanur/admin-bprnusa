export const listProduk = (payload) => ({
  type: "LIST_PRODUK",
  payload
});

export const deleteProduk = (produkId) => ({
  type: "DELETE_PRODUK",
  payload: produkId
});