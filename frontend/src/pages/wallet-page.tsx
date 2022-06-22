import { ReloadOutlined, TransactionOutlined } from '@ant-design/icons';
import { Button, Descriptions, Empty, Input, PageHeader, Skeleton, Space, Tabs, Tooltip } from 'antd';
import { Observer } from 'mobx-react';
import * as React from 'react';
import { useContext, useEffect } from 'react';
import { StoreContext } from '../App';
import Money from '../components/money';
import TransactionItem from '../components/transaction-item';

export interface IWalletPageProps {}

export function WalletPage(props: IWalletPageProps) {
  const storeContext = useContext(StoreContext);
  const walletStore = storeContext.walletStore;

  useEffect(() => {
    walletStore.fetchTransactions();
    walletStore.fetchPendingTransactions();
  }, [walletStore, walletStore.fetchTransactions, walletStore.fetchPendingTransactions]);

  const handleRefreshWallet = () => {
    walletStore.fetchTransactions();
    walletStore.fetchPendingTransactions();
  };

  return (
    <div className="container">
      <div className="mx-auto w-75 shadow rounded p-4 m-3">
        <Observer>
          {() =>
            walletStore.isLoadingWallet ? (
              <Skeleton active />
            ) : (
              <>
                <PageHeader
                  title="My Inforrmation"
                  extra={[
                    <Button key="1" className="d-flex align-items-center" type="primary" icon={<TransactionOutlined />}>
                      Create Transaction
                    </Button>,
                    <Tooltip title="Refresh your Wallet">
                      <Button key="2" className="d-flex align-items-center" onClick={handleRefreshWallet}>
                        <ReloadOutlined />
                      </Button>
                    </Tooltip>,
                  ]}
                />
                <div className="my-2">
                  <Money amount={walletStore.balance} />
                </div>
                <Descriptions bordered>
                  <Descriptions.Item label="Adress" span={3} className="font-monospace">
                    <Observer>{() => <>{walletStore.wallet?.publicKey}</>}</Observer>
                  </Descriptions.Item>
                  <Descriptions.Item label="Private Key" span={3} className="font-monospace">
                    <Observer>{() => <Input.Password value={walletStore.wallet?.privateKey} readOnly />}</Observer>
                  </Descriptions.Item>
                </Descriptions>
              </>
            )
          }
        </Observer>
      </div>

      <div className="mx-auto w-75 shadow rounded p-4 m-3">
        <Tabs defaultActiveKey="1" animated>
          <Tabs.TabPane tab="My Transactions History" key="1">
            <div>
              <Observer>
                {() =>
                  walletStore.isLoadingWallet ? (
                    <Skeleton active />
                  ) : (
                    <>
                      {walletStore.wallet.transactions.length <= 0 ? (
                        <Empty />
                      ) : (
                        <Space>
                          {walletStore.wallet.transactions.map((tx, index) => (
                            <TransactionItem key={index} transaction={tx} wallet={walletStore.wallet} />
                          ))}
                        </Space>
                      )}
                    </>
                  )
                }
              </Observer>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="My Pending Transactions" key="2">
            <div>
              <Observer>
                {() =>
                  walletStore.isLoadingPendingTransactions ? (
                    <Skeleton active />
                  ) : walletStore.myPendingTransactions.length <= 0 ? (
                    <Empty />
                  ) : (
                    <Space direction="vertical">
                      {walletStore.myPendingTransactions.map((tx, index) => (
                        <TransactionItem key={index} transaction={tx} wallet={walletStore.wallet} />
                      ))}
                    </Space>
                  )
                }
              </Observer>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
}
