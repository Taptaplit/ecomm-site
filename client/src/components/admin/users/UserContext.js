export const userState = {
  users: []
};

export const userReducer = (state, action) => {
  switch (action.type) {
    case "fetchUsers":
      return {
        ...state,
        users: action.payload,
      };
    default:
      return state;
  }
};
