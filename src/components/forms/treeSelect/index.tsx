import { Form, FormItemProps, TreeSelect, TreeSelectProps } from 'antd';
import React from 'react';
import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';

const defaultData = [
  {
    title: 'Node1',
    value: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-1'
      },
      {
        title: 'Child Node2',
        value: '0-0-2'
      }
    ]
  },
  {
    title: 'Node2',
    value: '0-1'
  }
];

interface IProps {
  placeholder?: string;
  defaultTreeAllDataShow?: boolean;
  label: string;
  required: boolean;
  name: string;
  errors?: any;
  onChangeApp?: any;
  treeSelectProps?: TreeSelectProps;
  formItemProps?: FormItemProps;
  control: any;
  rules?: Omit<
    RegisterOptions<FieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  treeData: any;
  isMulti?: boolean;
  isDisabled?: boolean;
  isClearable?: boolean;
  notFoundContent?: React.ReactNode;
  showSearch?: boolean;
  isParent?: boolean;
}

function AppHandlerTreeSelect({
  placeholder,
  defaultTreeAllDataShow,
  label,
  required,
  name,
  onChangeApp,
  errors,
  formItemProps,
  control,
  rules,
  treeSelectProps,
  treeData,
  isMulti,
  isDisabled,
  isClearable,
  notFoundContent,
  showSearch,
  isParent
}: IProps) {
  return (
    <Form.Item
      label={label}
      // labelCol={{ span: 24, }}
      required={required}
      htmlFor={name}
      tooltip={errors[name] ? errors[name].message : ''}
      name={name}
      {...formItemProps}
    >
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <TreeSelect
            style={{ width: '100%' }}
            value={value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData || defaultData}
            placeholder={placeholder}
            treeDefaultExpandAll={defaultTreeAllDataShow}
            multiple={isMulti}
            disabled={isDisabled}
            showCheckedStrategy={isParent ? 'SHOW_PARENT' : 'SHOW_CHILD'}
            allowClear={isClearable}
            onChange={(e: any) => {
              onChange(e);
              onChangeApp && onChangeApp(e);
            }}
            notFoundContent={notFoundContent}
            showSearch={showSearch}
            {...treeSelectProps}
          />
        )}
      />
    </Form.Item>
  );
}

export default AppHandlerTreeSelect;
