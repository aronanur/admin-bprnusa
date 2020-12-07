export const dataJenisKredit = (payload) => ({
  type: "DATA_JENIS_KREDIT",
  payload
});

export const addDataJenisKredit = (payload) => ({
  type: "ADD_DATA_JENIS_KREDIT",
  payload
});

export const updateDataJenisKredit = (payload) => ({
  type: "UPDATE_DATA_JENIS_KREDIT",
  payload
});

export const deleteDataJenisKredit = (id) => ({
  type: "DELETE_DATA_JENIS_KREDIT",
  payload: { id }
});

export const dataTipeKonten = (payload) => ({
  type: "DATA_TIPE_KONTEN",
  payload
});

export const addDataTipeKonten = (payload) => ({
  type: "ADD_DATA_TIPE_KONTEN",
  payload
});

export const updateDataTipeKonten = (payload) => ({
  type: "UPDATE_DATA_TIPE_KONTEN",
  payload
});

export const deleteDataTipeKonten = (id) => ({
  type: "DELETE_DATA_TIPE_KONTEN",
  payload: { id }
});

export const dataTipeLampiran = (payload) => ({
  type: "DATA_TIPE_LAMPIRAN",
  payload
});

export const addDataTipeLampiran = (payload) => ({
  type: "ADD_DATA_TIPE_LAMPIRAN",
  payload
});

export const updateDataTipeLampiran = (payload) => ({
  type: "UPDATE_DATA_TIPE_LAMPIRAN",
  payload
});

export const deleteDataTipeLampiran = (id) => ({
  type: "DELETE_DATA_TIPE_LAMPIRAN",
  payload: { id }
});