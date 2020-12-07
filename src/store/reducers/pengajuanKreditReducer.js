const initialState = {
  listPengajuanKredit: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case "LIST_PENGAJUAN_KREDIT":
      return { ...state, listPengajuanKredit: action.payload }
    default:
      return state;
  }
}