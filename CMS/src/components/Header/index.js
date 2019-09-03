import React from 'react';
import { Layout, Icon, Avatar, Popover } from 'antd';
import styles from './index.less'

const Header = ({ collapsed, toggle }) => {
  const logOut = (<span>log out</span>);
  return (
    <Layout.Header className={styles.container}>
      <div className={styles.toggle} onClick={toggle}>
        <Icon
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          className={styles.icon}
        />
      </div>
      <Popover className={styles.user} content={logOut} placement="bottom" >
        <span>Hi, guest</span>
        <Avatar size={40} src="https://kenh14cdn.com/2019/6/2/a6-1559457174050796195069.jpg" className={styles.avatar} />
      </Popover>

    </Layout.Header>
  )
}

export default Header;
