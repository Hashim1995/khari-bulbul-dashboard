import React from 'react';
import { Col, PaginationProps, Row, Table } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import {
  RowSelectionType,
  TablePaginationConfig
} from 'antd/es/table/interface';
import AppPagination from '../pagination';
import AppEmpty from '../empty';

interface IProps extends TableProps<any> {
  columns: ColumnsType<any>;
  data: any;
  pagination?: false | TablePaginationConfig | undefined;
  rowSelection?: {
    type?: RowSelectionType | undefined;
    onChange?: () => void;
    onSelect?: () => void;
  };
  currentPage?: number;
  // eslint-disable-next-line no-unused-vars
  onChangePage?: (page: number, pageSize: number) => void;
  totalPage?: number;
  tableProps?: TableProps<any>;
  paginationProps?: PaginationProps;
}

// const rowSelection = {
//   onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
//     console.log(
//       `selectedRowKeys: ${selectedRowKeys}`,
//       'selectedRows: ',
//       selectedRows
//     );
//   }
// };

function AppHandledTable({
  columns,
  data,
  rowSelection,
  pagination = false,
  currentPage,
  totalPage,
  onChangePage,
  ...tableProps
}: IProps) {
  return (
    <div>
      <Row className="pb-10">
        <Col span={24}>
          <Table
            pagination={pagination}
            rowSelection={
              rowSelection
                ? {
                    ...rowSelection
                  }
                : undefined
            }
            columns={columns}
            locale={{
              emptyText: <AppEmpty />
            }}
            dataSource={data}
            {...tableProps}
          />
        </Col>
      </Row>
      <Row justify="end" className="generalPagination">
        <Col>
          <AppPagination
            current={currentPage}
            total={totalPage}
            onChange={onChangePage}
            {...tableProps.paginationProps}
          />
        </Col>
      </Row>
    </div>
  );
}

export default AppHandledTable;
