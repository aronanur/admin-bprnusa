export const listKonten = (payload) => ({
  type: "LIST_KONTEN",
  payload
});

export const deleteKonten = (kontenId) => ({
  type: "DELETE_KONTEN",
  payload: kontenId
});