import { useState } from 'react';
import { Col, Form, Row, Space, theme } from 'antd';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import AppHandledInput from '@/components/forms/input/handled-input';
import { dictionary } from '@/utils/constants/dictionary';
import { inputValidationText } from '@/utils/constants/validations';
import { inputPlaceholderText } from '@/utils/constants/texts';
import { ILogin, ILoginResponse } from '@/models/user';

import { AuthService } from '@/services/auth-services/auth-services';
// import { ReactComponent as Illustration } from '@/assets/images/illustration.svg';
import { useNavigate } from 'react-router-dom';
import AppHandledButton from '@/components/display/button/handle-button';
import { mainLogo, rightSideImage } from '@/configs/theme-config';
import Logo from '@/assets/images/logo.png.png';

function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ILogin>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const { useToken } = theme;
  const { token } = useToken();
  const darkMode = useReadLocalStorage('darkTheme');
  const navigate = useNavigate();

  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);
  // eslint-disable-next-line no-unused-vars
  const [userToken, setUserToken] = useLocalStorage<any>('userToken', null);
  const onSubmit: SubmitHandler<ILogin> = async (data: ILogin) => {
    setIsFormSubmiting(true);

    const payload = {
      email: data.email,
      password: data.password
    };

    const res: ILoginResponse = await AuthService.getInstance().login(
      payload,
      () => setIsFormSubmiting(false)
    );
    // setUserToken({ token: res.token });
    // navigate('/home');

    if (res.isSuccess) {
      setUserToken({ token: res.data.token });
      navigate('/home');
    }
    setIsFormSubmiting(false);
  };

  return (
    <Row style={{ backgroundColor: darkMode ? '#000' : '#fff' }}>
      <Col span={12}>
        <Row className="h-screen" align={'middle'} justify={'center'}>
          <Col span={12}>
            <Row className="w-full" align="middle" justify="center">
              <Col span={15} className="box-margin-y">
                <img src={Logo} style={mainLogo?.style} alt="mainLogo" />
              </Col>
              <Col span={24}>
                <Form
                  layout="vertical"
                  onFinish={handleSubmit(onSubmit)}
                  id="login-form"
                >
                  <Space className="w-full" direction="vertical">
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
                            'Etibarlı e-poçt ünvanı daxil edin.'
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

                    <AppHandledButton
                      block
                      loading={isFormSubmiting}
                      type="primary"
                      htmlType="submit"
                    >
                      {dictionary.az.login}
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
            <img
              src={rightSideImage?.src}
              style={rightSideImage?.style}
              alt="right-side-img"
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Login;
