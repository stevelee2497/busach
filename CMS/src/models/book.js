import {
  fetchBooks
} from '../services/api';

export default {
  namespace: 'book',
  state: {
    dataSource: [],
    page: 1,
    pageSize: 10,
    total: 100,
    bookFormVisible: false,
    selected: undefined
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/books') {
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
      const response = yield call(fetchBooks, page, pageSize);
      yield put({ type: 'save', payload: response });
    },
    // *post({ payload }, { call, put, select }) {
    //   const { name } = payload;
    //   yield call(createAuthor, name);
    //   yield put({ type: 'closeAuthorModal' });
    //   yield put({ type: 'fetch' });
    // },
    // *delete({ payload: id }, { call, put, select }) {
    //   yield call(deleteAuthor, id);
    //   yield put({ type: 'fetch' });
    // },
    // *update({ payload }, { call, put, select }) {
    //   const { id, name } = payload;
    //   yield call(updateAuthor, id, name);
    //   yield put({ type: 'closeAuthorModal' });
    //   yield put({ type: 'fetch' });
    // },
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
    openBookForm(state, { payload }) {
      return {
        ...state,
        bookFormVisible: true,
        selected: payload
      }
    },
    closeBookForm(state) {
      return {
        ...state,
        bookFormVisible: false
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
