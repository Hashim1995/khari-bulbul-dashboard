import { Select, ConfigProvider, SelectProps, Empty } from 'antd';
// import { noDataText } from '@/utils/constants/texts';
import { dictionary } from '@/utils/constants/dictionary';

function AppSelect(props: SelectProps) {
  const filterOption: any = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  return (
    <ConfigProvider
      renderEmpty={() => (
        <Empty
          description={dictionary.az.noDataText}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    >
      <Select filterOption={filterOption} {...props} />
    </ConfigProvider>
  );
}

export default AppSelect;
