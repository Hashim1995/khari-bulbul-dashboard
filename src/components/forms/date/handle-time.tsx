import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { TimePicker, Form, FormItemProps, TimePickerProps } from 'antd';
import locale from 'antd/es/date-picker/locale/de_DE';
import { dictionary } from '@/utils/constants/dictionary';

interface IAppHandledTime {
  label?: string;
  name: string;
  control: any;
  rules?: Omit<
    RegisterOptions<FieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  required?: boolean;
  placeholder?: string;
  errors?: any;
  onChangeApp?: any;
  dateProps?: TimePickerProps;
  formItemProps?: FormItemProps;
}

function AppHandledTime({
  label,
  name,
  control,
  rules,
  required,
  placeholder,
  errors,
  onChangeApp,
  dateProps,
  formItemProps
}: IAppHandledTime) {
  return (
    <Form.Item
      label={<span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
      // labelCol={{ span: 24 }}
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
          <TimePicker
            value={value}
            status={required && errors[name] ? 'error' : undefined}
            className="gap-in-time-picker-footer"
            onChange={e => {
              onChange(e);
              onChangeApp && onChangeApp(e);
            }}
            placeholder={placeholder}
            locale={{
              ...locale,
              lang: {
                ...locale.lang,
                now: dictionary.az.now,
                ok: 'Tamam'
              }
            }}
            {...dateProps}
          />
        )}
      />
    </Form.Item>
  );
}

export default AppHandledTime;
