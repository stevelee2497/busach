import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import styles from './index.less'
import Brand from '../Brand';
import Link from 'umi/link';

const { Sider } = Layout;

const SideMenu = ({ collapsed, pathname }) => {
  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={256}>
      <Brand collapsed={collapsed} />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={[pathname]} className={styles.menu}>
        <Menu.Item key="/dashboard">
          <Link to="/dashboard" >
            <Icon type="dashboard" />
            <span>Dash board</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/categories">
          <Link to="/categories">
            <Icon type="book" />
            <span>Categories</span>
          </Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default SideMenu;
