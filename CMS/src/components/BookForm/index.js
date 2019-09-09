import React from "react";
import { Modal, Form, Input } from "antd";
import { Field, reduxForm } from 'redux-form';

const renderField = (field) => {
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

const BookForm = props => {
  const { handleSubmit, onCancel, visible, loading, invalid, title } = props;
  return (
    <Modal
      title={title}
      onOk={handleSubmit}
      onCancel={onCancel}
      visible={visible}
      confirmLoading={loading}
      okButtonProps={{ disabled: invalid }}
      width={700}
    >
      <Form
        labelCol={{
          xs: { span: 24 },
          sm: { span: 8 },
        }}
        wrapperCol={{
          xs: { span: 24 },
          sm: { span: 16 },
        }}
        style={{ padding: 20 }}
        onSubmit={handleSubmit} >
        <Field name="name" component={renderField} label="Book Name" />
        <Field name="description" component={renderField} label="Description" />
        <Field name="bookCoverUrl" component={renderField} label="Book Cover Url" />
        <Field name="owner" component={renderField} label="Owner" />
        <Field name="author" component={renderField} label="Author" />
        <Field name="categories" component={renderField} label="Categories" />
      </Form>
    </Modal>
  );
}

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
})(BookForm);
