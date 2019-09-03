import React from 'react';
import { Layout } from 'antd';
import styles from './index.less';
import SideMenu from '../components/SideMenu.js';
import Header from '../components/Header';
import CustomBreadcrumb from '../components/Breadcrumb';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { Content } = Layout;

toast.configure()

class BaseLayout extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    const { collapsed } = this.state;
    const { pathname } = this.props.location;
    return (
      <Layout className={styles.container}>
        <SideMenu collapsed={collapsed} pathname={pathname} />
        <Layout>
          <Header toggle={this.toggle} collapsed={collapsed} />
          <CustomBreadcrumb />
          <Content className={styles.content} children={this.props.children} />
        </Layout>
      </Layout>
    );
  }
}

export default BaseLayout;
