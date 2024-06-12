import { useState } from 'react';
import { Col, Form, Row, Space, theme } from 'antd';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import AppHandledInput from '@/components/forms/input/handled-input';
import { dictionary } from '@/utils/constants/dictionary';
import {
  inputValidationText,
  minLengthCheck
} from '@/utils/constants/validations';
import { inputPlaceholderText } from '@/utils/constants/texts';
import { IRegister, ILoginResponse } from '@/models/user';
import { AuthService } from '@/services/auth-services/auth-services';
import { ReactComponent as Illustration } from '@/assets/images/illustration.svg';
import { useNavigate } from 'react-router-dom';
import AppHandledInputMask from '@/components/forms/input-mask/handled-input-mask';
import AppHandledRadio from '@/components/forms/radio/handled-radio';
import AppHandledButton from '@/components/display/button/handle-button';
import { ReactComponent as Logo } from '@/assets/images/brand-logo.svg';

function Register() {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<IRegister>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      surname: '',
      username: '',
      fatherName: '',
      email: '',
      password: '',
      address: '',
      phone: '',
      mobilePhone: '',
      cardNumber: '',
      pin: '',
      tableNumber: '',
      birthdate: '',
      dateOfEmployment: '',
      dateOfDismissal: '',
      isTransactionsCounterpartyCard: false,
      division: '',
      initialAdjustmentTM: '',
      respondent: '',
      note: '',
      gender: 2,
      userType: 0,
      createdDate: '',
      fileId: 0
    }
  });

  const { useToken } = theme;
  const { token } = useToken();
  const darkMode = useReadLocalStorage('darkTheme');
  const navigate = useNavigate();

  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);
  // eslint-disable-next-line no-unused-vars
  const [userToken, setUserToken] = useLocalStorage<any>('userToken', null);
  const onSubmit: SubmitHandler<IRegister> = async (data: IRegister) => {
    setIsFormSubmiting(true);

    const payload = {
      email: data.email,
      password: data.password,
      name: data.name,
      surname: data.surname,
      fatherName: data.fatherName,
      phone: data.phone,
      gender: data.gender
    };

    const res: ILoginResponse = await AuthService.getInstance().login(
      payload,
      () => setIsFormSubmiting(false)
    );

    if (res) {
      setUserToken({ token: res.data.token });
      navigate('/home');
    }
    setIsFormSubmiting(false);
  };

  const options = [
    { label: 'Kişi', value: 1 },
    { label: 'Qadın', value: 2 },
    { label: 'Digər', value: 3 }
  ];

  return (
    <Row style={{ backgroundColor: darkMode ? '#000' : '#fff' }}>
      <Col span={12}>
        <Row className="h-screen" align={'middle'} justify={'center'}>
          <Col span={12}>
            <Row className="w-full" align="middle">
              <Col span={15}>
                <Logo
                  className="w-full"
                  style={{
                    height: 'fit-content',
                    marginBottom: 40
                  }}
                />
              </Col>
              <Col span={24}>
                <Form
                  layout="vertical"
                  onFinish={handleSubmit(onSubmit)}
                  id="register-form"
                >
                  <Space className="w-full" direction="vertical">
                    <AppHandledInput
                      label={dictionary.az.name}
                      name="Name"
                      inputProps={{
                        id: 'name'
                      }}
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText(dictionary.az.name)
                        },
                        minLength: {
                          value: 3,
                          message: minLengthCheck(dictionary.az.name, '3')
                        }
                      }}
                      required
                      control={control}
                      inputType="text"
                      placeholder={inputPlaceholderText(dictionary.az.name)}
                      errors={errors}
                    />
                    <AppHandledInput
                      label={dictionary.az.surname}
                      name="Surname"
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText(dictionary.az.surname)
                        },
                        minLength: {
                          value: 3,
                          message: minLengthCheck(dictionary.az.surname, '3')
                        }
                      }}
                      required
                      control={control}
                      inputType="text"
                      placeholder={inputPlaceholderText(dictionary.az.surname)}
                      errors={errors}
                    />
                    <AppHandledInput
                      label={dictionary.az.FathersName}
                      name="FathersName"
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText(
                            dictionary.az.FathersName
                          )
                        },
                        minLength: {
                          value: 3,
                          message: minLengthCheck(
                            dictionary.az.FathersName,
                            '3'
                          )
                        }
                      }}
                      required
                      control={control}
                      inputType="text"
                      placeholder={inputPlaceholderText(
                        dictionary.az.FathersName
                      )}
                      errors={errors}
                    />
                    <AppHandledInput
                      label={dictionary.az.email}
                      name="email"
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText(dictionary.az.email)
                        },
                        validate: {
                          checkOnlyEnglishChars: (value: string) =>
                            /^[\w\\.-]+@[\w\\.-]+\.\w+$/.test(value) ||
                            'Please enter a valid e-mail address.'
                        }
                      }}
                      required
                      control={control}
                      inputType="text"
                      placeholder={inputPlaceholderText(dictionary.az.email)}
                      errors={errors}
                    />
                    <AppHandledInput
                      label={dictionary.az.password}
                      name="password"
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText(dictionary.az.password)
                        }
                      }}
                      required
                      control={control}
                      inputType="password"
                      placeholder={inputPlaceholderText(dictionary.az.password)}
                      errors={errors}
                    />

                    <AppHandledRadio
                      label={dictionary.az.gender}
                      name="gender"
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText(dictionary.az.gender)
                        }
                      }}
                      required
                      control={control}
                      errors={errors}
                      isGroup
                      options={options}
                    />
                    <AppHandledInputMask
                      label={dictionary.az.contactNumber}
                      name="phone"
                      control={control}
                      mask="\+\9\9\4 99-999-99-99"
                      maskChar={null}
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText(
                            dictionary.az.contactNumber
                          )
                        },
                        pattern: {
                          value: /^\+994\d{9}$/,
                          message:
                            'Zəhmət olmasa düzgün telefon nömrəsi daxil edin'
                        }
                      }}
                      required
                      placeholder={inputPlaceholderText(
                        dictionary.az.contactNumber
                      )}
                      errors={errors}
                    />

                    <AppHandledButton
                      block
                      loading={isFormSubmiting}
                      type="primary"
                      htmlType="submit"
                    >
                      {dictionary.az.register}
                    </AppHandledButton>
                  </Space>
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col span={12}>
        <Row
          className="w-full h-full"
          justify="center"
          align="middle"
          style={{ backgroundColor: token.colorPrimary }}
        >
          <Col span={18}>
            <Illustration className="w-full" />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Register;
