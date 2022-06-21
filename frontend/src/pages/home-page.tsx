import { AccountBookOutlined, BlockOutlined } from '@ant-design/icons';
import { Avatar, Layout, Menu } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import { useRef } from 'react';
import { Link, Outlet } from 'react-router-dom';

export const HomePage = () => {
  const ref = useRef<Menu>(null);

  function handleLogoClick() {
    document.querySelector<HTMLAnchorElement>('ul li[data-menu-id*="wallet"]')?.click();
  }

  return (
    <Layout>
      <Header className="d-flex">
        <Link to={'/wallet'} onClick={handleLogoClick}>
          <div className="me-4 d-flex align-items-center">
            <Avatar src="/logo.png" />
            <div className="fs-2 mx-3" style={{ color: 'white' }}>
              NaiveCoin
            </div>
          </div>
        </Link>

        <div className="flex-fill">
          <Menu ref={ref} theme="dark" mode="horizontal" defaultSelectedKeys={['wallet']}>
            <Menu.Item key="wallet" icon={<AccountBookOutlined />}>
              <Link to={'/wallet'}>Wallet</Link>
            </Menu.Item>

            <Menu.Item key="blockchain" icon={<BlockOutlined />}>
              <Link to={'/blockchain'}>Blockchain</Link>
            </Menu.Item>
          </Menu>
        </div>
      </Header>

      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};
