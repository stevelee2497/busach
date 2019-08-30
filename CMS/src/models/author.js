import { notification } from 'antd';
import { fetchAuthors, createAuthor, deleteAuthor, updateAuthor } from '../services/api';

export default {
  namespace: 'author',
  state: {
    dataSource: [],
    page: 1,
    pageSize: 10,
    total: 100,
    authorModalVisible: false,
    selected: undefined
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/authors') {
          dispatch({
            type: 'fetch',
            payload: {
              page: 1,
              pageSize: 10
            }
          });
        }
      });
    },
  },
  effects: {
    *fetch({ payload }, { call, put, select }) {
      const { page, pageSize } = yield select(state => state.author);
      const response = yield call(fetchAuthors, page, pageSize);
      yield put({ type: 'save', payload: response });
    },
    *post({ payload }, { call, put, select }) {
      try {
        const { name } = payload;
        yield call(createAuthor, name);
        yield put({ type: 'closeAuthorModal' });
        yield put({ type: 'fetch' });
      } catch (error) {
        notification['error']({
          message: 'Ops',
          description: error.response.data.errorMessage,
        })
      }
    },
    *delete({ payload: id }, { call, put, select }) {
      yield call(deleteAuthor, id);
      yield put({ type: 'fetch' });
    },
    *update({ payload }, { call, put, select }) {
      const { id, name } = payload;
      yield call(updateAuthor, id, name);
      yield put({ type: 'closeAuthorModal' });
      yield put({ type: 'fetch' });
    },
    *changePagination({ payload }, { call, put, select }) {
      yield put({ type: 'savePagination', payload });
      yield put({ type: 'fetch' });
    }
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        dataSource: payload.data,
        total: payload.total
      };
    },
    openAuthorModal(state, { payload }) {
      return {
        ...state,
        authorModalVisible: true,
        selected: payload
      }
    },
    closeAuthorModal(state) {
      return {
        ...state,
        authorModalVisible: false
      }
    },
    savePagination(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    }
  },
};
