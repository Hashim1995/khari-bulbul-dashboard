import { Pagination, PaginationProps } from 'antd';
import { RightCircleOutlined } from '@ant-design/icons';
import AppHandledButton from '../button/handle-button';

function AppPagination(props: PaginationProps) {
  return (
    <Pagination
      style={{ marginTop: '20px', marginBottom: '20px' }}
      showQuickJumper={{
        goButton: (
          <AppHandledButton
            size="small"
            type="dashed"
            icon={<RightCircleOutlined rev={undefined} />}
          />
        )
      }}
      locale={{
        jump_to: '',
        page: ''
      }}
      size="small"
      showSizeChanger={false}
      {...props}
    />
  );
}

export default AppPagination;
