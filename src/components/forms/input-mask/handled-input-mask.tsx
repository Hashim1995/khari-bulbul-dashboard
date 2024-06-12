/* eslint-disable no-octal-escape */
/* eslint-disable no-nonoctal-decimal-escape */
import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { Form, FormItemProps, Input, InputProps } from 'antd';
import InputMask from 'react-input-mask';

interface IAppHandledInputMask {
  label?: string;
  name: string;
  control: any;
  rules?: Omit<
    RegisterOptions<FieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  required?: boolean;
  inputType?: string;
  placeholder?: string;
  errors?: any;
  mask: string;
  maskChar?: string | null;
  onChangeApp?: any;
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
}
// @ts-ignore: Unreachable code error
function AppHandledInputMask({
  label,
  name,
  control,
  rules,
  required,
  inputType,
  placeholder,
  errors,
  onChangeApp,
  formItemProps,
  mask,
  inputProps,
  maskChar = null
}: IAppHandledInputMask) {
  return (
    <Form.Item
      label={<span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
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
          <InputMask
            mask={mask}
            maskChar={maskChar}
            alwaysShowMask
            value={value}
            onChange={(e: any) => {
              const rawValue: string =
                e?.target?.value?.replace(/[\s()\-_]/g, '') || '';
              onChange(rawValue);
              onChangeApp && onChangeApp(rawValue);
            }}
          >
            {/* 
// @ts-ignore */}
            <Input
              {...inputProps}
              status={required && errors[name] ? 'error' : undefined}
              id={name}
              type={inputType || 'text'}
              value={value}
              placeholder={placeholder || ''}
            />
          </InputMask>
        )}
      />
    </Form.Item>
  );
}

export default AppHandledInputMask;
