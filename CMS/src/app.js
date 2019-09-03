import { reducer as formReducer } from 'redux-form'
import { notification } from 'antd';
import router from 'umi/router';

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      if (err.response) {
        notification['error']({
          message: 'Ops',
          description: err.response.data.errorMessage,
        })
        router.push('/500');
      } else {
        notification['error']({
          message: 'Ops',
          description: err.message,
        });
        router.push('/404');
      }

    },
    extraReducers: {
      form: formReducer,
    },
  },
};
