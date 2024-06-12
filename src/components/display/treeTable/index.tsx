/* eslint-disable no-unused-vars */
import React from 'react';
import { MenuProps, Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { BsFillPrinterFill } from 'react-icons/bs';
import { MdRefresh } from 'react-icons/md';
import './style.scss';
import AppHandlerTooltip from '../tooltip';
import AppHandlerDropdown from '../dropdown';
import AppPagination from '../pagination';
import AppEmpty from '../empty';

interface IProps {
  column: ColumnsType<any>;
  data: any;
  dropdownTitle?: string;
  controlDropdownTitle?: string;
  dropdownItems?: MenuProps['items'];
  controlDropdownItems?: MenuProps['items'];
  showIcon?: boolean;
  currentPage?: number;
  totalPage?: number;
  onChangePage?: (e: number) => void;
  tableProps?: TableProps<any>;
  onClickExportFile?: () => void;
}

function AppHandlerTreeTable({
  column,
  data,
  dropdownTitle,
  dropdownItems,
  showIcon,
  controlDropdownTitle,
  controlDropdownItems,
  currentPage,
  totalPage,
  onChangePage,
  onClickExportFile,
  tableProps
}: IProps) {
  return (
    <div className="treeTableContainer">
      <div className="treeTableHeader">
        {controlDropdownTitle && (
          <AppHandlerDropdown
            title={controlDropdownTitle}
            items={controlDropdownItems}
            otherMenuProps={{
              selectable: true,
              multiple: true,
              defaultSelectedKeys: ['3']
            }}
          />
        )}
        {dropdownTitle && (
          <AppHandlerDropdown title={dropdownTitle} items={dropdownItems} />
        )}
      </div>
      <div className="mb-10">
        <Table
          columns={column}
          dataSource={data}
          pagination={false}
          {...tableProps}
          locale={{
            emptyText: <AppEmpty />
          }}
        />
      </div>
      <div className="treeTablePagination">
        <AppPagination
          current={currentPage}
          total={totalPage}
          onChange={onChangePage}
        />
      </div>
    </div>
  );
}

export default AppHandlerTreeTable;
