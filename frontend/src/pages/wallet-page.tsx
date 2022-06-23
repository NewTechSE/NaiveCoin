import { ReloadOutlined, TransactionOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Descriptions,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  PageHeader,
  Result,
  Skeleton,
  Space,
  Tabs,
  Tooltip,
} from 'antd';
import { ResultStatusType } from 'antd/lib/result';
import { Observer } from 'mobx-react';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
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

  const [form] = Form.useForm();

  const [visibleForm, setVisibleForm] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [visibleResult, setVisibleResult] = useState(false);
  const [resultMsg, setResultMsg] = useState('');
  const [resultStatus, setResultStatus] = useState<ResultStatusType>('success');

  const handleCreateTransaction = () => {
    form.validateFields().then(async values => {
      setConfirmLoading(true);

      try {
        await walletStore.createTransaction({
          fromAddress: walletStore.wallet.publicKey,
          toAddress: values.toAddress,
          amount: values.amount,
          timestamp: Date.now(),
        });

        setResultStatus('success');
        setResultMsg('Transaction created successfully');
      } catch (error: any) {
        setResultStatus('error');
        setResultMsg(error.response.data.message);
      } finally {
        setTimeout(() => {
          setVisibleForm(false);
          setConfirmLoading(false);

          setVisibleResult(true);
        }, 500);
      }
    });
  };

  return (
    <div className="container">
      <div className="mx-auto w-75 shadow rounded p-4 m-3 bg-white">
        <Observer>
          {() =>
            walletStore.isLoadingWallet ? (
              <Skeleton active />
            ) : (
              <>
                <PageHeader
                  title="My Inforrmation"
                  extra={[
                    <Button
                      key="1"
                      className="d-flex align-items-center"
                      type="primary"
                      icon={<TransactionOutlined />}
                      onClick={() => setVisibleForm(true)}
                    >
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

      <div className="mx-auto w-75 shadow rounded p-4 m-3 bg-white">
        <Tabs defaultActiveKey="1" animated>
          <Tabs.TabPane tab="My Transactions History" key="1">
            <div>
              <Observer>
                {() =>
                  walletStore.isLoadingWallet ? (
                    <Skeleton active />
                  ) : (
                    <>
                      {walletStore.wallet.transactions.slice().sort((a, b) => b.timestamp! - a.timestamp!).length <=
                      0 ? (
                        <Empty />
                      ) : (
                        <Space direction="vertical">
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
                      {walletStore.myPendingTransactions
                        .slice()
                        .sort((a, b) => b.timestamp! - a.timestamp!)
                        .map((tx, index) => (
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

      <Modal
        title="Create Transaction"
        visible={visibleForm}
        confirmLoading={confirmLoading}
        onOk={handleCreateTransaction}
        onCancel={() => setVisibleForm(false)}
        centered={true}
      >
        <Form form={form} labelCol={{ span: 6 }}>
          <Form.Item
            label="To Address"
            name={'toAddress'}
            rules={[{ required: true, message: "Please input receiver's wallet address" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Coin Amount"
            name={'amount'}
            rules={[
              {
                required: true,
                pattern: /^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/,
                message: 'Coin amount must be a positive number and greater than 0',
              },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              // max={walletStore.balance}
              addonBefore={<Avatar src="./logo.png" size={24} className="d-flex align-items-center" />}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={visibleResult}
        centered={true}
        cancelButtonProps={{ hidden: true }}
        onOk={() => setVisibleResult(false)}
        onCancel={() => setVisibleResult(false)}
      >
        <Result title={resultMsg} status={resultStatus} />
      </Modal>
    </div>
  );
}
