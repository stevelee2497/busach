import { put, takeEvery } from 'redux-saga/effects';
import faker from 'faker';
import { BOOK_TYPE } from '../AppConstants';
import { fetchBooksSuccess, fetchBookSuccess } from '../actions';
import { FETCH_BOOKS, FETCH_BOOK } from '../actions/actionTypes';
import { randomImage } from '../helpers/imageHelper';

function* fetchBooks({ payload }) {
  const { type, page, limit } = payload;
  switch (type) {
    case BOOK_TYPE.FEATURING_BOOKS:
      break;
    default:
  }

  const books = Array.from({ length: limit }).map(_ => ({
    id: faker.random.uuid(),
    name: faker.random.words(2),
    description: faker.random.words(500),
    rate: faker.random.number({ min: 1, max: 5 }),
    readCount: faker.random.number(10, 1000),
    likedCount: faker.random.number(10, 1000),
    status: faker.random.boolean(),
    imageUrl: randomImage(200, 300),
    coverUrl: randomImage(1000, 600),
    author: faker.random.words(4),
    chapterCount: faker.random.number({ min: 400, max: 1000 })
  }));

  yield put(fetchBooksSuccess(books, type));
}

export function* watchFetchBooks() {
  yield takeEvery(FETCH_BOOKS, fetchBooks);
}

function* fetchBook({ payload }) {
  const { id } = payload;

  const book = {
    id,
    name: faker.random.words(2),
    description: faker.random.words(500),
    rate: faker.random.number({ min: 1, max: 5 }),
    readCount: faker.random.number(10, 1000),
    likedCount: faker.random.number(10, 1000),
    status: faker.random.boolean(),
    imageUrl: randomImage(200, 300),
    coverUrl: randomImage(1000, 600),
    author: faker.random.words(4),
    chapterCount: faker.random.number({ min: 400, max: 1000 })
  };

  yield put(fetchBookSuccess(book));
}

export function* watchFetchBook() {
  yield takeEvery(FETCH_BOOK, fetchBook);
}
