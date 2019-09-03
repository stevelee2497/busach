import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Table, Divider, Modal } from 'antd';
import styles from './index.less';
import moment from 'moment';
import { reset } from 'redux-form';
import SimpleNameForm from '../../components/SimpleNameForm';

class Authors extends Component {
  handlePageChanged = (page, pageSize) => {
    this.props.dispatch({
      type: 'author/changePagination',
      payload: {
        page,
        pageSize,
      },
    });
  };

  openAuthorModal = () => {
    this.props.dispatch(reset('nameForm'));
    this.props.dispatch({
      type: 'author/openAuthorModal',
    });
  };

  closeAuthorModal = () => {
    this.props.dispatch({
      type: 'author/closeAuthorModal'
    });
  };

  handleSubmitCreateAuthor = values => {
    const { selected } = this.props.author;
    if (selected) {
      this.props.dispatch({
        type: 'author/update',
        payload: {
          id: selected.id,
          name: values.name
        }
      });
    } else {
      this.props.dispatch({
        type: 'author/post',
        payload: {
          name: values.name
        }
      });
    }
  }

  handleUpdate = record => {
    this.props.dispatch({
      type: 'author/openAuthorModal',
      payload: record
    });
  }

  handleDelete = record => {
    Modal.confirm({
      title: 'Bạn có muốn xóa tác giả này?',
      content: 'Tác giả: ' + record.name,
      okType: 'danger',
      onOk: () => {
        this.props.dispatch({
          type: 'author/delete',
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
        sorter: (a, b) => a.name.localeCompare(b.name),
        width: 400,
        className: styles.name
      },
      {
        title: 'Books Count',
        render: (text, record) => (<span>{record.bookCount || 0}</span>),
        sorter: (a, b) => a.bookCount - b.bookCount,
      },
      {
        title: 'Created Date',
        render: (text, record) => (<span>{moment(record.createdTime).format("DD/MM/YYYY")}</span>),
        sorter: (a, b) => moment(a.createdTime) - moment(b.createdTime),
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

    const { author, loading } = this.props;
    const { pageSize, total, page, authorModalVisible, selected, dataSource } = author;

    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: total,
      onChange: this.handlePageChanged,
      onShowSizeChange: this.handlePageChanged,
      defaultPageSize: pageSize,
      defaultCurrent: page,
    };

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Button type="primary" onClick={this.openAuthorModal}>
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
        <SimpleNameForm
          onSubmit={this.handleSubmitCreateAuthor}
          onCancel={this.closeAuthorModal}
          visible={authorModalVisible}
          loading={loading}
          enableReinitialize
          initialValues={{ name: selected && selected.name }}
          destroyOnUnmount={false}
          keepDirtyOnReinitialize={true}
          title="Author"
          label="Author name"
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  author: state.author,
  loading: state.loading.global,
});

export default connect(mapStateToProps)(Authors);
