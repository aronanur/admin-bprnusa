export const listPendaftarKerja = (payload) => ({
  type: "LIST_PENDAFTAR_KERJA",
  payload
});

export const changeStatusPengajuan = (id, status) => ({
  type: "CHANGE_STATUS_PENGAJUAN",
  payload: { id, status }
});