import { Table, Popconfirm, Button } from 'antd';

const ProductList = ({ onDelete, products, loading }) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Actions',
      render: (text, record) => {
        return (
          <Popconfirm title="Delete?" onConfirm={() => onDelete(record.id)}>
            <Button>Delete</Button>
          </Popconfirm>
        );
      },
    },
  ];
  return (
    <Table
      dataSource={products}
      columns={columns}
      loading={loading}
      rowKey="id"
      pagination={{ showSizeChanger: true, showQuickJumper: true }}
      bordered
    />
  );
};

export default ProductList;
