import { Card, Descriptions, PageHeader } from 'antd';
import moment from 'moment';
import * as React from 'react';
import { ITransactionModel } from '../models/transaction-model';
import Money from './money';

export interface ITransactionItemProps {
  transaction: ITransactionModel;
}

export default function TransactionItem(props: ITransactionItemProps) {
  const { transaction } = props;

  const renderTitle = () => {
    return (
      <PageHeader
        title={<Money amount={transaction.amount ?? 0} />}
        extra={[moment(transaction.timestamp).format('MMMM Do YYYY, h:mm:ss A')]}
      />
    );
  };

  return (
    <Card title={renderTitle()}>
      <Descriptions bordered>
        <Descriptions.Item label="From Adress" span={3} className="font-monospace">
          {transaction.fromAddress}
        </Descriptions.Item>
        <Descriptions.Item label="Signature" span={3} className="font-monospace">
          {transaction.signature}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
