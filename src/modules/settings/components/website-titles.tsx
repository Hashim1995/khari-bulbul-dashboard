import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Card,
  Col,
  Collapse,
  Form,
  Row,
  Space,
  Spin,
  Typography,
  Tabs
} from 'antd';
import { toast } from 'react-toastify';
import { dictionary } from '@/utils/constants/dictionary';
import { inputPlaceholderText } from '@/utils/constants/texts';
import { convertFormDataToQueryParams } from '@/utils/functions/functions';
import { SettingssServices } from '@/services/settings-services/settings-service';
import AppHandledButton from '@/components/display/button/handle-button';
import AppHandledInput from '@/components/forms/input/handled-input';
import { IHTTPSParams } from '@/services/adapter-config/config';
import { maxLengthCheck } from '@/utils/constants/validations';
import { IWebsiteTitles, IGetWebsiteTitlesResponse } from '../models';

function WebsiteTitles() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<IWebsiteTitles>({
    mode: 'onChange',
    defaultValues: {
      aboutUsContent: '',
      aboutUsHeader: '',
      eventsContent: '',
      eventsHeader: '',
      mainContent: '',
      mainHeader: '',
      newsContent: '',
      newsHeader: '',
    }
  });

  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  // eslint-disable-next-line no-unused-vars
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [skeleton, setSkeleton] = useState(true);
  const [activeTabKey, setActiveTabKey] = useState<string>('Az');

  const fetchData = async () => {
    setIsFormSubmitting(true);
    const queryParamsData: IHTTPSParams[] = convertFormDataToQueryParams({
      language: activeTabKey.toLocaleLowerCase()
    });
    setQueryParams(queryParamsData);

    try {
      const res: IGetWebsiteTitlesResponse =
        await SettingssServices.getInstance().getWebsiteTitles(queryParamsData);

      if (res?.isSuccess) {
        setValue('aboutUsContent', res?.data?.aboutUsContent ?? '');
        setValue('aboutUsHeader', res?.data?.aboutUsHeader ?? '');
        setValue('eventsContent', res?.data?.eventsContent ?? '');
        setValue('eventsHeader', res?.data?.eventsHeader ?? '');
        setValue('mainContent', res?.data?.mainContent ?? '');
        setValue('mainHeader', res?.data?.mainHeader ?? '');
        setValue('newsContent', res?.data?.newsContent ?? '');
        setValue('newsHeader', res?.data?.newsHeader ?? '');
        setSkeleton(false);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const onSubmit = async (data: IWebsiteTitles) => {
    setIsFormSubmitting(true);
    try {
      let languageCode;
      const activeTabKeyLowerCase = activeTabKey.toLocaleLowerCase();

      if (activeTabKeyLowerCase === 'az') {
        languageCode = 1;
      } else if (activeTabKeyLowerCase === 'de') {
        languageCode = 3;
      } else {
        languageCode = 2;
      }

      const payload = {
        language: languageCode,
        ...data
      };

      const res = await SettingssServices.getInstance().updateWebsiteTitles(
        payload
      );

      if (res.isSuccess) {
        toast.success(dictionary.az.successTxt);
        setRefreshComponent(prev => !prev);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshComponent, activeTabKey]);

  const handleChangeTab = (key: string) => {
    setActiveTabKey(key);
  };
  function renderForm() {
    return (
      <Collapse
        expandIconPosition="end"
        ghost
        style={{
          padding: '0'
        }}
        defaultActiveKey="1"
        size="small"
      >
        <Collapse.Panel
          key={1}
          className="p-0"
          header={
            <Typography.Text type="secondary">
              {dictionary.az.websiteTitles}
            </Typography.Text>
          }
        >
          {!skeleton ? (
            <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
              <Row gutter={[16, 16]}>
                {/* Your form fields */}
                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.aboutUsContent}
                    name="aboutUsContent"
                    inputProps={{
                      id: 'aboutUsContent'
                    }}
                    rules={{
                      maxLength: {
                        value: 1000,
                        message: maxLengthCheck(
                          dictionary.az.aboutUsContent,
                          '1000'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(
                      dictionary.az.aboutUsContent
                    )}
                    errors={errors}
                  />
                </Col>

                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.aboutUsHeader}
                    name="aboutUsHeader"
                    inputProps={{
                      id: 'aboutUsHeader'
                    }}
                    rules={{
                      maxLength: {
                        value: 200,
                        message: maxLengthCheck(
                          dictionary.az.aboutUsHeader,
                          '200'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(
                      dictionary.az.aboutUsHeader
                    )}
                    errors={errors}
                  />
                </Col>

                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.eventsContent}
                    name="eventsContent"
                    inputProps={{
                      id: 'eventsContent'
                    }}
                    rules={{
                      maxLength: {
                        value: 500,
                        message: maxLengthCheck(
                          dictionary.az.eventsContent,
                          '500'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(
                      dictionary.az.eventsContent
                    )}
                    errors={errors}
                  />
                </Col>

                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.eventsHeader}
                    name="eventsHeader"
                    inputProps={{
                      id: 'eventsHeader'
                    }}
                    rules={{
                      maxLength: {
                        value: 200,
                        message: maxLengthCheck(
                          dictionary.az.eventsHeader,
                          '200'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(
                      dictionary.az.eventsHeader
                    )}
                    errors={errors}
                  />
                </Col>

                {/* Your form fields */}
                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.mainContent}
                    name="mainContent"
                    inputProps={{
                      id: 'mainContent'
                    }}
                    rules={{
                      maxLength: {
                        value: 500,
                        message: maxLengthCheck(
                          dictionary.az.mainContent,
                          '500'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(dictionary.az.mainContent)}
                    errors={errors}
                  />
                </Col>

                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.mainHeader}
                    name="mainHeader"
                    inputProps={{
                      id: 'mainHeader'
                    }}
                    rules={{
                      maxLength: {
                        value: 200,
                        message: maxLengthCheck(
                          dictionary.az.mainHeader,
                          '200'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(
                      dictionary.az.mainHeader
                    )}
                    errors={errors}
                  />
                </Col>

                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.newsContent}
                    name="newsContent"
                    inputProps={{
                      id: 'newsContent'
                    }}
                    rules={{
                      maxLength: {
                        value: 1000,
                        message: maxLengthCheck(
                          dictionary.az.newsContent,
                          '1000'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(
                      dictionary.az.newsContent
                    )}
                    errors={errors}
                  />
                </Col>

                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.newsHeader}
                    name="newsHeader"
                    inputProps={{
                      id: 'newsHeader'
                    }}
                    rules={{
                      maxLength: {
                        value: 200,
                        message: maxLengthCheck(
                          dictionary.az.newsHeader,
                          '200'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(
                      dictionary.az.newsHeader
                    )}
                    errors={errors}
                  />
                </Col>

              </Row>
              <Row justify="end">
                <div style={{ textAlign: 'right' }}>
                  <Space size="small">
                    <AppHandledButton
                      disabled={isFormSubmitting}
                      loading={isFormSubmitting}
                      type="primary"
                      htmlType="submit"
                    >
                      {dictionary.az.save}
                    </AppHandledButton>
                  </Space>
                </div>
              </Row>
            </Form>
          ) : (
            <Row className="w-full" justify="center" align="middle">
              <Spin size="large" />
            </Row>
          )}
        </Collapse.Panel>
      </Collapse>
    );
  }
  return (
    <Card size="small" className="box box-margin-y">
      <div className="generalFilter">
        <Tabs defaultActiveKey="Az" onChange={handleChangeTab}>
          <Tabs.TabPane tab="Azərbaycan" key="Az">
            {renderForm()}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Ingilis" key="Eng">
            {renderForm()}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Alman" key="De">
            {renderForm()}
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Card>
  );
}

export default WebsiteTitles;
