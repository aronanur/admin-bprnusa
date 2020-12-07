export const loggedUser = (payload) => ({
  type: "LOGGED_USER",
  payload
});

export const logoutUser = () => ({
  type: "LOGOUT_USER"
});

export const staffData = (payload) => ({
  type: "STAFF_DATA",
  payload
});

export const userData = (payload) => ({
  type: "USER_DATA",
  payload
});

export const changeRoles = (id, roles) => ({
  type: "CHANGE_ROLES",
  payload: { id, roles }
});

export const changeStatus = (id, status) => ({
  type: "CHANGE_STATUS",
  payload: { id, status }
});

export const deleteStaff = (id) => ({
  type: "DELETE_STAFF",
  payload: { id }
});

export const deleteUser = (id) => ({
  type: "DELETE_USER",
  payload: { id }
});