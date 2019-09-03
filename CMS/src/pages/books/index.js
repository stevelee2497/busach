import React from 'react'
import { connect } from 'dva';
import { Button, Table, Divider } from 'antd';
import styles from './index.less'
import { reset } from 'redux-form';
import BookForm from '../../components/BookForm';

const Books = props => {
  const { loading, book, handleUpdate, handleSubmitCreateCategory, handleDelete } = props;

  const { dataSource, pageSize, total, page, bookFormVisible } = book;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      render: (text, record) => (<span className={styles.description}>{record.description}</span>),
      width: 400
    },
    {
      title: 'Author',
      render: (text, record) => (<span>{record.author.name}</span>),
      sorter: (a, b) => a.author.name.localeCompare(b.author.name),
    },
    {
      title: 'Category',
      render: (text, record) => (<span>{record.categories.map(value => value.name).join(',')}</span>),
      sorter: (a, b) => a.author.name.localeCompare(b.author.name),
    },
    {
      title: 'Action',
      render: (text, record) => {
        return (
          <span className={styles.actions}>
            <a onClick={() => handleUpdate(record)}>Update</a>
            <Divider type="vertical" />
            <a >Block</a>
            <Divider type="vertical" />
            <a onClick={() => handleDelete(record)}>Delete</a>
          </span>
        );
      },
      width: 200
    }
  ];

  const pagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    total: total,
    onChange: props.handlePageChanged,
    onShowSizeChange: props.handlePageChanged,
    defaultPageSize: pageSize,
    defaultCurrent: page,
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button type="primary" onClick={props.openBookForm}>
          Create
        </Button>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={pagination}
        bordered
      />
      <BookForm
        visible={bookFormVisible}
        onSubmit={handleSubmitCreateCategory}
        onCancel={props.closeBookForm}
        title="Book"
        enableReinitialize
        destroyOnUnmount={false}
        keepDirtyOnReinitialize={true}
      />
    </div>
  )
};

const mapStateToProps = (state) => ({
  book: state.book,
  loading: state.loading.global,
});

const mapDispatchToProps = dispatch => ({
  openBookForm: () => {
    dispatch(reset('nameForm'));
    dispatch({ type: 'book/openBookForm' });
  },
  closeBookForm: () => {
    dispatch({ type: 'book/closeBookForm' });
  },
  handlePageChanged: (page, pageSize) => {
    dispatch({
      type: 'category/changePagination',
      payload: { page, pageSize }
    });
  },
  handleUpdate: record => {
  },
  handleDelete: record => {
  },
  handleSubmitCreateCategory: () => {
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Books);
