const initialState = {
  listProduk: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case "LIST_PRODUK":
      return { ...state, listProduk: action.payload }
    case "DELETE_PRODUK":
      return { ...state, listProduk: state.listProduk.filter((value) => value.id !== action.payload) }
    default:
      return state;
  }
}