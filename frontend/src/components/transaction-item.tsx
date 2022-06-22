import { Card, Descriptions, PageHeader } from 'antd';
import moment from 'moment';
import * as React from 'react';
import { ITransactionModel } from '../models/transaction-model';
import { IWalletModel } from '../models/wallet-model';
import Money from './money';

export interface ITransactionItemProps {
  transaction: ITransactionModel;
  wallet: IWalletModel;
}

export default function TransactionItem(props: ITransactionItemProps) {
  const { transaction, wallet } = props;

  const renderTitle = () => {
    return (
      <PageHeader
        title={<Money amount={transaction.amount ?? 0} />}
        extra={[moment(transaction.timestamp).format('MMMM Do YYYY, h:mm:ss A')]}
      />
    );
  };

  const myAddress = wallet.publicKey ?? '';

  return (
    <Card title={renderTitle()}>
      <Descriptions bordered>
        <Descriptions.Item
          label="From Adress"
          span={3}
          className={`font-monospace ${transaction.fromAddress === myAddress ? 'fw-bold' : ''}`}
        >
          {transaction.fromAddress}
        </Descriptions.Item>
        <Descriptions.Item
          label="To Adress"
          span={3}
          className={`font-monospace ${transaction.toAddress === myAddress ? 'fw-bold' : ''}`}
        >
          {transaction.toAddress}
        </Descriptions.Item>
        <Descriptions.Item label="Signature" span={3} className="font-monospace">
          {transaction.signature}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
