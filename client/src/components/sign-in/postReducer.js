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
        required: false,
        loading: true,
        success: false,
        error: false,
      };
    case ACTION_TYPES.POST_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
      };
    case ACTION_TYPES.POST_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};
