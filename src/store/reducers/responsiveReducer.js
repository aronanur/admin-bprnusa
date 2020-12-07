const initialState = {
  sidebarShow: 'responsive'
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'set':
      return {...state, sidebarShow: action.payload }
    default:
      return state
  }
}