const initialState = {
  listKontak: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case "LIST_KONTAK":
      return { ...state, listKontak: action.payload }
    default:
      return state;
  }
}