const initialState = {
  listKonten: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case "LIST_KONTEN":
      return { ...state, listKonten: action.payload }
    case "DELETE_KONTEN":
      return { ...state, listKonten: state.listKonten.filter((value) => value.id !== action.payload) }
    default:
      return state;
  }
}