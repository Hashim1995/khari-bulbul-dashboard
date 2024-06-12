import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

interface IProps {
  items: TabsProps['items'];
  onChange?: () => void;
  defaultActiveKey?: string;
  tabProps?: TabsProps;
}

function AppHandlerTab({
  items,
  onChange,
  defaultActiveKey,
  tabProps
}: IProps) {
  return (
    <Tabs
      defaultActiveKey={defaultActiveKey}
      items={items}
      onChange={onChange}
      {...tabProps}
    />
  );
}

export default AppHandlerTab;
