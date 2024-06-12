import { DownOutlined } from '@ant-design/icons';
import type { DropdownProps, MenuProps } from 'antd';
import { Button, Dropdown, Space } from 'antd';

interface IProps {
  items: MenuProps['items'];
  title: string;
  dropdownProps?: DropdownProps;
  otherMenuProps?: MenuProps;
}

function AppHandlerDropdown({
  items,
  title,
  dropdownProps,
  otherMenuProps
}: IProps) {
  return (
    <Dropdown
      menu={{ items, ...otherMenuProps }}
      {...dropdownProps}
      trigger={['click']}
    >
      <span aria-hidden onClick={e => e.preventDefault()}>
        <Space>
          <Button>
            {title}
            <DownOutlined />
          </Button>
        </Space>
      </span>
    </Dropdown>
  );
}

export default AppHandlerDropdown;
