import { Result, Button } from "antd";

export default () => {
  return (
    <Result
      status="500"
      title="500"
      subTitle="Sorry, the server is wrong."
      extra={<Button type="primary">Back Home</Button>}
      style={{ alignSelf: 'center' }}
    />
  );
};
