import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { Form, FormItemProps, Checkbox } from 'antd';
import { CheckboxProps } from 'antd/es/checkbox';
import { ReactNode } from 'react';

interface IAppHandledCheckbox {
  label?: string;
  name: string;
  control?: any;
  rules?: Omit<
    RegisterOptions<FieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  required?: boolean;
  errors?: any;
  onChangeApp?: any;
  checkboxProps?: CheckboxProps;
  formItemProps?: FormItemProps;
  children?: ReactNode;
  defaultValue?: boolean;
}

function AppHandledCheckbox({
  label,
  name,
  control,
  rules,
  required,
  errors,
  onChangeApp,
  checkboxProps,
  formItemProps,
  children,
  defaultValue
}: IAppHandledCheckbox) {
  return (
    <Form.Item
      label={label}
      required={required}
      htmlFor={name}
      tooltip={errors[name] ? errors[name].message : ''}
      name={name}
      valuePropName="checked"
      className="checkbox-item"
      {...formItemProps}
    >
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field: { onChange } }) => (
          <Checkbox
            {...checkboxProps}
            defaultChecked={defaultValue}
            id={name}
            onChange={e => {
              onChange(e);
              onChangeApp && onChangeApp(e);
            }}
          >
            {children}
          </Checkbox>
        )}
      />
    </Form.Item>
  );
}

export default AppHandledCheckbox;
