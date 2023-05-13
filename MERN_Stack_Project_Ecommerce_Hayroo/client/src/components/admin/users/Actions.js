import { getAllUser } from "./FetchApi";

export const fetchData = async (dispatch) => {
  dispatch({ type: "loading", payload: true });
  let responseData = await getAllUser();
  setTimeout(() => {
    if (responseData && responseData.Users) {
      dispatch({
        type: "fetchUsers",
        payload: responseData.Users,
      });
      dispatch({ type: "loading", payload: false });
    }
  }, 500);
};