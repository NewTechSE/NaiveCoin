import { Anchor, Descriptions } from 'antd';
import moment from 'moment';
import * as React from 'react';
import { IBlockModel } from '../models/block-model';

export interface IBlockItemProps {
  block: IBlockModel;
  onBlockTitleClick?: (block: IBlockModel) => void;
}

export default function BlockItem(props: IBlockItemProps) {
  const { block, onBlockTitleClick } = props;

  return (
    <div>
      <Descriptions
        title={
          <Anchor
            onClick={() => {
              if (onBlockTitleClick) {
                onBlockTitleClick(block);
              }
            }}
          >
            <Anchor.Link title={`Block #${block.id}`} />
          </Anchor>
        }
        bordered
        extra={moment(block.timestamp).format('MMMM Do YYYY, h:mm:ss A')}
        className="border p-4"
      >
        <Descriptions.Item label="Previous Hash" span={3} className="font-monospace">
          {block.previousHash}
        </Descriptions.Item>
        <Descriptions.Item label="Hash" span={3} className="font-monospace">
          {block.hash}
        </Descriptions.Item>
        <Descriptions.Item label="Number of Transaction" className="font-monospace">
          {block.transactions?.length}
        </Descriptions.Item>
        <Descriptions.Item label="Nonce" className="font-monospace">
          {block.nonce}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
