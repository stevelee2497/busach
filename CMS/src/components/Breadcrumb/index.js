import { Breadcrumb } from 'antd';
import Link from 'umi/link';

const CustomBreadcrumb = ({path}) => {
  return (
    <Breadcrumb style={{marginLeft: 16, marginTop: 16}}>
      <Breadcrumb.Item>
        <Link to="/dashboard">Dash Board</Link>
      </Breadcrumb.Item>
    </Breadcrumb>
  )
}

export default CustomBreadcrumb;
