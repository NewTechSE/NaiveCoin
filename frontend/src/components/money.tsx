import { Avatar, Space, Typography } from 'antd';
import { Observer } from 'mobx-react';
import * as React from 'react';

export interface IMoneyProps {
  amount: number;
}

export default function Money(props: IMoneyProps) {
  return (
    <Space className="d-flex align-items-center">
      <Avatar size={16} src="/logo.png" />
      <Typography.Text strong style={{ fontSize: 20 }}>
        <Observer>{() => <>{Intl.NumberFormat('us-US').format(props.amount)}</>}</Observer>
      </Typography.Text>
    </Space>
  );
}
