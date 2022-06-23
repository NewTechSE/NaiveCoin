import { TransactionOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Empty, notification, PageHeader, Skeleton, Space, Tooltip } from 'antd';
import { Observer } from 'mobx-react';
import * as React from 'react';
import { useContext, useEffect } from 'react';
import { StoreContext } from '../App';
import TransactionItem from '../components/transaction-item';

export interface IPendingTransactionsPageProps {}

export function PendingTransactionsPage(props: IPendingTransactionsPageProps) {
  const storeContext = useContext(StoreContext);
  const walletStore = storeContext.walletStore;
  const pendingTransactionStore = storeContext.pendingTransactionStore;

  useEffect(() => {
    pendingTransactionStore.fetchPendingTransactions();
  }, [pendingTransactionStore, pendingTransactionStore.fetchPendingTransactions]);

  const handleRefreshList = () => {
    pendingTransactionStore.fetchPendingTransactions();
  };

  const handleMineBlock = () => {
    if (pendingTransactionStore.pendingTransactions.length > 0) {
      pendingTransactionStore.mineNewBlock(walletStore.keyPair.getPublic('hex'));

      notification.open({
        message: 'Mining Block...',
        description: 'This may take a while. Once done, reward will be sent to your wallet.',
        duration: 0,
      });
    }
  };

  return (
    <div className="container">
      <div className="mx-auto w-75 shadow rounded p-4 m-3 bg-white">
        <Observer>
          {() =>
            pendingTransactionStore.isLoading ? (
              <Skeleton active />
            ) : (
              <>
                <PageHeader
                  title={`Pending Transactions - ${pendingTransactionStore.pendingTransactions.length} items`}
                  extra={[
                    <Button
                      key="1"
                      className="d-flex align-items-center"
                      type="primary"
                      icon={<TransactionOutlined />}
                      onClick={handleMineBlock}
                      disabled={pendingTransactionStore.pendingTransactions.length === 0}
                    >
                      Mine New Block
                    </Button>,
                    <Tooltip title="Refresh List">
                      <Button key="2" className="d-flex align-items-center" onClick={handleRefreshList}>
                        <ReloadOutlined />
                      </Button>
                    </Tooltip>,
                  ]}
                />
                {pendingTransactionStore.pendingTransactions.length <= 0 ? (
                  <Empty />
                ) : (
                  <Space direction="vertical">
                    {pendingTransactionStore.pendingTransactions
                      .slice()
                      .sort((a, b) => b.timestamp! - a.timestamp!)
                      .map((tx, index) => (
                        <TransactionItem key={index} transaction={tx} wallet={walletStore.wallet} />
                      ))}
                  </Space>
                )}
              </>
            )
          }
        </Observer>
      </div>
    </div>
  );
}
