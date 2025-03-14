export const INITIAL_STATE = {
  loading: false,
  success: false,
  error: false,
};

export const postReducer = (state, action) => {
  switch (action.type) {
    case "POST_START":
      return {
        required: false,
        loading: true,
        success: false,
        error: false,
      };
    case "POST_SUCCESS":
      return {
        ...state,
        loading: false,
        success: true,
      };
    case "POST_ERROR":
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};
