const initialState = {
  loginStatus: false,
  user: null,
  staffData: null,
  userData: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "LOGGED_USER":
      return { ...state, loginStatus: true, user: action.payload };
    case "LOGOUT_USER":
      return { ...state, loginStatus: false };
    case "STAFF_DATA":
      return { ...state, staffData: action.payload }
    case "USER_DATA":
      return { ...state, userData: action.payload }
    case "CHANGE_ROLES":
      return { ...state, staffData: changeRoles(state.staffData, { id: action.payload.id, roles: action.payload.roles }) }
    case "CHANGE_STATUS":
      return { ...state, userData: changeStatus(state.userData, { id: action.payload.id, status: action.payload.status }) }
    case "DELETE_STAFF":
      return { ...state, staffData: state.staffData.filter((value) => value.id !== action.payload.id) }
    case "DELETE_USER":
      return { ...state, userData: state.userData.filter((value) => value.id !== action.payload.id) }
    default:
      return state;
  }
}

const changeRoles = (staffData, parameter) => {
  staffData.forEach((value) => {
    if (value["id"] === parameter.id) {
      value["roles"] = parameter.roles
    }
  })
  return staffData;
}

const changeStatus = (userData, parameter) => {
  console.log('masuk')
  userData.forEach((value) => {
    if (value["id"] === parameter.id) {
      value["isActive"] = parameter.status
    }
  })
  return userData;
}