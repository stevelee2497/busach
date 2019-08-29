import React from 'react';
import { Modal, Form, Input } from 'antd';
import { Field, reduxForm } from 'redux-form';

const renderNameField = (field) => {
  const { input, meta: { touched, error } } = field;
  return (
    <Form.Item
      label="Category Name"
      required
      help={touched && error}
      validateStatus={touched && error ? 'error' : ''}
    >
      <Input placeholder="Tên thể loại" {...input} type="text" />
    </Form.Item>
  )
};

const CategoryModal = props => {
  const { handleSubmit, onCancel, visible, loading, invalid } = props;
  return (
    <Modal
      title="Category"
      onOk={handleSubmit}
      onCancel={onCancel}
      visible={visible}
      confirmLoading={loading}
      okButtonProps={{ disabled: invalid }}
    >
      <Form layout="inline" onSubmit={handleSubmit} >
        <Field name="categoryName" component={renderNameField} label="Category Name" />
      </Form>
    </Modal>
  );
};

const validate = (values) => {
  const errors = {};
  if (!values.categoryName) {
    errors.categoryName = 'Required';
  }
  return errors;
};

export default reduxForm({
  form: 'category',
  validate,
})(CategoryModal);
