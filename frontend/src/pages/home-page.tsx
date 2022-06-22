import { AccountBookOutlined, BlockOutlined, BuildOutlined } from '@ant-design/icons';
import { Avatar, Layout, Menu } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('HomePage: Auto go to wallet page');
    navigate('/wallet');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['wallet']}>
            <Menu.Item key="wallet" icon={<AccountBookOutlined />}>
              <Link to={'/wallet'}>Wallet</Link>
            </Menu.Item>

            <Menu.Item key="blockchain" icon={<BlockOutlined />}>
              <Link to={'/blockchain'}>Blockchain</Link>
            </Menu.Item>

            <Menu.Item key="pending-transactions" icon={<BuildOutlined />}>
              <Link to={'/pending-transactions'}>Pending Transactions</Link>
            </Menu.Item>
          </Menu>
        </div>
      </Header>

      <Content className="bg-white">
        <Outlet />
      </Content>
    </Layout>
  );
};
