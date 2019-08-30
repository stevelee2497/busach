import React from 'react';
import { Modal, Form, Input } from 'antd';
import { Field, reduxForm } from 'redux-form';

const renderNameField = (field) => {
  const { input, label, meta: { touched, error } } = field;
  return (
    <Form.Item
      label={label}
      required
      help={touched && error}
      validateStatus={touched && error ? 'error' : ''}
    >
      <Input {...input} type="text" />
    </Form.Item>
  )
};

const SimpleNameForm = props => {
  const { handleSubmit, onCancel, visible, loading, invalid, label, title } = props;
  return (
    <Modal
      title={title}
      onOk={handleSubmit}
      onCancel={onCancel}
      visible={visible}
      confirmLoading={loading}
      okButtonProps={{ disabled: invalid }}
    >
      <Form layout="inline" onSubmit={handleSubmit} >
        <Field name="name" component={renderNameField} label={label} />
      </Form>
    </Modal>
  );
};

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }
  return errors;
};

export default reduxForm({
  form: 'nameForm',
  validate,
})(SimpleNameForm);
