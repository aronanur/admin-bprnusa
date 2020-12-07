const initialState = {
  listPendaftarKerja: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LIST_PENDAFTAR_KERJA':
      return { ...state, listPendaftarKerja: action.payload }
    case 'CHANGE_STATUS_PENGAJUAN':
      return { ...state, listPendaftarKerja: changeStatusPengajuan(state.listPendaftarKerja, { id: action.payload.id, status: action.payload.status }) }

    default:
      return state;
  }
}

const changeStatusPengajuan = (listPendaftarKerja, parameter) => {
  listPendaftarKerja.forEach((value) => {
    if (value["id"] === parameter.id) {
      value["statusPengajuan"] = parameter.status
    }
  })
  return listPendaftarKerja;
}