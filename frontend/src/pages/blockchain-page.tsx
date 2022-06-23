import { ReloadOutlined } from '@ant-design/icons';
import { Button, Empty, PageHeader, Skeleton, Space, Tabs, Tooltip } from 'antd';
import { Observer } from 'mobx-react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { StoreContext } from '../App';
import BlockItem from '../components/block-item';
import TransactionItem from '../components/transaction-item';
import { IBlockModel } from '../models/block-model';

export interface IBlockchainPageProps {}

export function BlockchainPage(props: IBlockchainPageProps) {
  const storeContext = React.useContext(StoreContext);
  const blockchainStore = storeContext.blockchainStore;
  const walletStore = storeContext.walletStore;

  useEffect(() => {
    blockchainStore.fetchBlocks();
  }, [blockchainStore, blockchainStore.fetchBlocks]);

  const handleRefreshBlockchain = () => {
    blockchainStore.fetchBlocks();
  };

  const [selectedBlock, setSelectedBlock] = useState<IBlockModel>();

  const handleBlockTitleClick = (block: IBlockModel) => {
    setSelectedTab('2');
    setSelectedBlock(block);
  };

  const [selectedTab, setSelectedTab] = useState('1');

  return (
    <div className="container">
      <div className="mx-auto w-75 shadow rounded p-4 mt-3 bg-white">
        <Observer>
          {() =>
            blockchainStore.isLoading ? (
              <Skeleton active />
            ) : (
              <Tabs
                defaultActiveKey="1"
                animated
                activeKey={selectedTab}
                tabBarExtraContent={
                  <Tooltip title="Refresh your Blockchain">
                    <Button className="d-flex align-items-center" onClick={handleRefreshBlockchain}>
                      <ReloadOutlined />
                    </Button>
                  </Tooltip>
                }
              >
                <Tabs.TabPane key="1">
                  <Observer>
                    {() =>
                      blockchainStore.blocks.length <= 0 ? (
                        <Empty />
                      ) : (
                        <>
                          {blockchainStore.blocks.map((block, index) => (
                            <div className="my-2">
                              <BlockItem key={index} block={block} onBlockTitleClick={handleBlockTitleClick} />
                            </div>
                          ))}
                        </>
                      )
                    }
                  </Observer>
                </Tabs.TabPane>
                <Tabs.TabPane key="2">
                  <PageHeader title={`Block #${selectedBlock?.id}`} onBack={() => setSelectedTab('1')} />
                  {selectedBlock === undefined || selectedBlock?.transactions.length <= 0 ? (
                    <Empty description="No Transaction" />
                  ) : (
                    <Space direction="vertical">
                      {selectedBlock.transactions.map((tx, index) => (
                        <TransactionItem key={index} transaction={tx} wallet={walletStore.wallet} />
                      ))}
                    </Space>
                  )}
                </Tabs.TabPane>
              </Tabs>
            )
          }
        </Observer>
      </div>
    </div>
  );
}
