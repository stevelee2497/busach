import { fetchCategories, createCategory, deleteCategory, updateCategory } from '../services/api';
import { notification } from 'antd';

export default {
  namespace: 'category',
  state: {
    dataSource: [],
    page: 1,
    pageSize: 10,
    categoryModalVisible: false,
    selected: undefined
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/categories') {
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
      const { page, pageSize } = yield select(state => state.category);
      const dataSource = yield call(fetchCategories, page, pageSize);
      yield put({ type: 'save', payload: dataSource });
    },
    *post({ payload }, { call, put, select }) {
      try {
        const { name } = payload;
        yield call(createCategory, name);
        yield put({ type: 'closeCategoryModal' });
        yield put({ type: 'fetch' });
      } catch (error) {
        notification['error']({
          message: 'Ops',
          description: error.response.data.errorMessage,
        })
      }
    },
    *delete({ payload: id }, { call, put, select }) {
      yield call(deleteCategory, id);
      yield put({ type: 'fetch' });
    },
    *update({ payload }, { call, put, select }) {
      const { id, name } = payload;
      yield call(updateCategory, id, name);
      yield put({ type: 'closeCategoryModal' });
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
        dataSource: payload
      };
    },
    openCategoryModal(state, { payload }) {
      return {
        ...state,
        categoryModalVisible: true,
        selected: payload
      }
    },
    closeCategoryModal(state) {
      return {
        ...state,
        categoryModalVisible: false
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
