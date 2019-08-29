import { reducer as formReducer } from 'redux-form'

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.response);
    },
    extraReducers: {
      form: formReducer,
    },
  },
};
