import { Link, Outlet } from 'umi';
import { Layout, Menu, theme } from 'antd';

import './index.less';

const { Header, Content, Footer } = Layout;

export default function () {

  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const menuItems = [
    {
      key: 'home',
      label: <Link to="/">Home</Link>,
    },
    {
      key: 'docs',
      label: <Link to="/docs">Docs</Link>,
    },
    {
      key: 'input',
      label: <Link to="/input">Рассчет</Link>,
    },
    {
      key: 'auth',
      label: <Link to="/auth">Войти</Link>,
    }

  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>

  );
}
