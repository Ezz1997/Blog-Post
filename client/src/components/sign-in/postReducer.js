import { ACTION_TYPES } from "./postActionTypes";

export const INITIAL_STATE = {
  loading: false,
  success: false,
  error: false,
};

export const postReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.POST_START:
      return {
        loading: true,
        success: false,
        error: false,
      };
    case ACTION_TYPES.POST_SUCCESS:
      return {
        error: false,
        loading: false,
        success: true,
      };
    case ACTION_TYPES.POST_ERROR:
      return {
        success: false,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};
