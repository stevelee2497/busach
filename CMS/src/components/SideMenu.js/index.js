import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import styles from './index.less'
import Brand from '../Brand';
import Link from 'umi/link';
import images from '../../utils/images';

const { Sider } = Layout;

const routes = [
  { path: '/dashboard', icon: <Icon type="dashboard" />, name: 'Dash Board' },
  { path: '/categories', icon: <Icon type="book" />, name: 'Category' },
  { path: '/authors', icon: <Icon component={() => (<img src={images.author} alt="" className={styles.author} />)} />, name: 'Author' },
  { path: '/books', icon: <Icon component={() => (<img src={images.books} alt="" className={styles.author} />)} />, name: 'Book' },
]

const SideMenu = ({ collapsed, pathname }) => {
  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={256}>
      <Brand collapsed={collapsed} />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={[pathname]} className={styles.menu}>
        {routes.map(route =>
          <Menu.Item key={route.path} className={styles.menuItem}>
            <Link to={route.path} >
              {route.icon}
              <span>{route.name}</span>
            </Link>
          </Menu.Item>)
        }
      </Menu>
    </Sider>
  );
}

export default SideMenu;
