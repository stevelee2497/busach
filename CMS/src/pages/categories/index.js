import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Table, Divider, Modal } from 'antd';
import styles from './index.less';
import moment from 'moment';
import CategoryModal from '../../components/CategoryModal';
import { reset } from 'redux-form';

class Categories extends Component {
  handlePageChanged = (page, pageSize) => {
    this.props.dispatch({
      type: 'category/changePagination',
      payload: {
        page,
        pageSize,
      },
    });
  };

  openCategoryModal = () => {
    this.props.dispatch(reset('category'));
    this.props.dispatch({
      type: 'category/openCategoryModal',
    });
  };

  closeCategoryModal = () => {
    this.props.dispatch({
      type: 'category/closeCategoryModal'
    });
  };

  handleSubmitCreateCategory = values => {
    const { selected } = this.props.category;
    if (selected) {
      this.props.dispatch({
        type: 'category/update',
        payload: {
          id: selected.id,
          name: values.categoryName
        }
      });
    } else {
      this.props.dispatch({
        type: 'category/post',
        payload: {
          name: values.categoryName
        }
      });
    }
  }

  handleUpdate = record => {
    this.props.dispatch({
      type: 'category/openCategoryModal',
      payload: record
    });
  }

  handleDelete = record => {
    Modal.confirm({
      title: 'Bạn có muốn xóa thể loại này?',
      content: 'Thể loại: ' + record.name,
      okType: 'danger',
      onOk: () => {
        this.props.dispatch({
          type: 'category/delete',
          payload: record.id
        });
      },
      okCancel: () => { }
    });
  }

  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.name - b.name,
        width: 400,
        className: styles.name
      },
      {
        title: 'Books Count',
        dataIndex: 'bookCount',
        sorter: (a, b) => a.bookCount - b.bookCount,
      },
      {
        title: 'Created Date',
        render: (text, record) => (<span>{moment(record.createdDate).format("DD/MM/YYYY")}</span>)
      },
      {
        title: 'Action',
        render: (text, record) => {
          return (
            <span>
              <Button type="link" onClick={() => this.handleUpdate(record)}>Update</Button>
              <Divider type="vertical" />
              <Button type="link">Block</Button>
              <Divider type="vertical" />
              <Button type="link" onClick={() => this.handleDelete(record)}>Delete</Button>
            </span>
          );
        },
      }
    ];

    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: 100,
      onChange: this.handlePageChanged,
      onShowSizeChange: this.handlePageChanged,
      defaultPageSize: 10,
      defaultCurrent: 1,
    };

    const { category, loading } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Button type="primary" onClick={this.openCategoryModal}>
            Create
          </Button>
        </div>
        <Table
          dataSource={category.dataSource}
          columns={columns}
          loading={loading}
          rowKey="id"
          pagination={pagination}
          bordered
        />
        <CategoryModal
          onSubmit={this.handleSubmitCreateCategory}
          onCancel={this.closeCategoryModal}
          visible={category.categoryModalVisible}
          loading={loading}
          enableReinitialize
          initialValues={{ categoryName: category.selected && category.selected.name }}
          destroyOnUnmount={false}
          keepDirtyOnReinitialize={true}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  category: state.category,
  loading: state.loading.global,
});

export default connect(mapStateToProps)(Categories);
