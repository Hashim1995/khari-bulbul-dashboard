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
      articleContent: '',
      articleHeader: '',
      bioContent: '',
      booksContent: '',
      booksHeader: '',
      caruselGalleryContent: '',
      caruselGalleryHeader: '',
      founderContent: '',
      founderHeader: '',
      founderSpeciality: '',
      newsLetterContent: '',
      newsLetterHeader: '',
      photoGalleryContent: '',
      photoGalleryHeader: ''
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
        setValue('articleContent', res?.data?.articleContent ?? '');
        setValue('articleHeader', res?.data?.articleHeader ?? '');
        setValue('bioContent', res?.data?.bioContent ?? '');
        setValue('booksContent', res?.data?.booksContent ?? '');
        setValue('booksHeader', res?.data?.booksHeader ?? '');
        setValue(
          'caruselGalleryContent',
          res?.data?.caruselGalleryContent ?? ''
        );
        setValue('caruselGalleryHeader', res?.data?.caruselGalleryHeader ?? '');
        setValue('founderContent', res?.data?.founderContent ?? '');
        setValue('founderHeader', res?.data?.founderHeader ?? '');
        setValue('founderSpeciality', res?.data?.founderSpeciality ?? '');
        setValue('newsLetterContent', res?.data?.newsLetterContent ?? '');
        setValue('newsLetterHeader', res?.data?.newsLetterHeader ?? '');
        setValue('photoGalleryContent', res?.data?.photoGalleryContent ?? '');
        setValue('photoGalleryHeader', res?.data?.photoGalleryHeader ?? '');
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
      } else if (activeTabKeyLowerCase === 'ru') {
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
                    label={dictionary.az.articleContent}
                    name="articleContent"
                    inputProps={{
                      id: 'articleContent'
                    }}
                    rules={{
                      maxLength: {
                        value: 500,
                        message: maxLengthCheck(
                          dictionary.az.articleContent,
                          '500'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(
                      dictionary.az.articleContent
                    )}
                    errors={errors}
                  />
                </Col>

                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.articleHeader}
                    name="articleHeader"
                    inputProps={{
                      id: 'articleHeader'
                    }}
                    rules={{
                      maxLength: {
                        value: 200,
                        message: maxLengthCheck(
                          dictionary.az.articleHeader,
                          '200'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(
                      dictionary.az.articleHeader
                    )}
                    errors={errors}
                  />
                </Col>

                {/* Your form fields */}
                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.bioContent}
                    name="bioContent"
                    inputProps={{
                      id: 'bioContent'
                    }}
                    rules={{
                      maxLength: {
                        value: 1000,
                        message: maxLengthCheck(
                          dictionary.az.bioContent,
                          '1000'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(dictionary.az.bioContent)}
                    errors={errors}
                  />
                </Col>

                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.booksContent}
                    name="booksContent"
                    inputProps={{
                      id: 'booksContent'
                    }}
                    rules={{
                      maxLength: {
                        value: 500,
                        message: maxLengthCheck(
                          dictionary.az.booksContent,
                          '500'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(
                      dictionary.az.booksContent
                    )}
                    errors={errors}
                  />
                </Col>

                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.booksHeader}
                    name="booksHeader"
                    inputProps={{
                      id: 'booksHeader'
                    }}
                    rules={{
                      maxLength: {
                        value: 200,
                        message: maxLengthCheck(
                          dictionary.az.booksHeader,
                          '200'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(
                      dictionary.az.booksHeader
                    )}
                    errors={errors}
                  />
                </Col>

                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.caruselGalleryContent}
                    name="caruselGalleryContent"
                    inputProps={{
                      id: 'caruselGalleryContent'
                    }}
                    rules={{
                      maxLength: {
                        value: 500,
                        message: maxLengthCheck(
                          dictionary.az.caruselGalleryContent,
                          '500'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(
                      dictionary.az.caruselGalleryContent
                    )}
                    errors={errors}
                  />
                </Col>

                {/* Your form fields */}
                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.caruselGalleryHeader}
                    name="caruselGalleryHeader"
                    inputProps={{
                      id: 'caruselGalleryHeader'
                    }}
                    rules={{
                      maxLength: {
                        value: 200,
                        message: maxLengthCheck(
                          dictionary.az.caruselGalleryHeader,
                          '200'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(
                      dictionary.az.caruselGalleryHeader
                    )}
                    errors={errors}
                  />
                </Col>

                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.founderContent}
                    name="founderContent"
                    inputProps={{
                      id: 'founderContent'
                    }}
                    rules={{
                      maxLength: {
                        value: 1000,
                        message: maxLengthCheck(
                          dictionary.az.founderContent,
                          '1000'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(
                      dictionary.az.founderContent
                    )}
                    errors={errors}
                  />
                </Col>

                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.founderHeader}
                    name="founderHeader"
                    inputProps={{
                      id: 'founderHeader'
                    }}
                    rules={{
                      maxLength: {
                        value: 100,
                        message: maxLengthCheck(
                          dictionary.az.founderHeader,
                          '100'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(
                      dictionary.az.founderHeader
                    )}
                    errors={errors}
                  />
                </Col>

                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.founderSpeciality}
                    name="founderSpeciality"
                    inputProps={{
                      id: 'founderSpeciality'
                    }}
                    rules={{
                      maxLength: {
                        value: 100,
                        message: maxLengthCheck(
                          dictionary.az.founderSpeciality,
                          '100'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(
                      dictionary.az.founderSpeciality
                    )}
                    errors={errors}
                  />
                </Col>

                {/* Your form fields */}
                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.newsLetterContent}
                    name="newsLetterContent"
                    inputProps={{
                      id: 'newsLetterContent'
                    }}
                    rules={{
                      maxLength: {
                        value: 500,
                        message: maxLengthCheck(
                          dictionary.az.newsLetterContent,
                          '500'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(
                      dictionary.az.newsLetterContent
                    )}
                    errors={errors}
                  />
                </Col>

                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.newsLetterHeader}
                    name="newsLetterHeader"
                    inputProps={{
                      id: 'newsLetterHeader'
                    }}
                    rules={{
                      maxLength: {
                        value: 200,
                        message: maxLengthCheck(
                          dictionary.az.newsLetterHeader,
                          '200'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(
                      dictionary.az.newsLetterHeader
                    )}
                    errors={errors}
                  />
                </Col>

                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.photoGalleryContent}
                    name="photoGalleryContent"
                    inputProps={{
                      id: 'photoGalleryContent'
                    }}
                    rules={{
                      maxLength: {
                        value: 500,
                        message: maxLengthCheck(
                          dictionary.az.photoGalleryContent,
                          '500'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(
                      dictionary.az.photoGalleryContent
                    )}
                    errors={errors}
                  />
                </Col>

                <Col span={12}>
                  <AppHandledInput
                    label={dictionary.az.photoGalleryHeader}
                    name="photoGalleryHeader"
                    inputProps={{
                      id: 'photoGalleryHeader'
                    }}
                    rules={{
                      maxLength: {
                        value: 200,
                        message: maxLengthCheck(
                          dictionary.az.photoGalleryHeader,
                          '200'
                        )
                      }
                    }}
                    control={control}
                    required={false}
                    inputType="text"
                    placeholder={inputPlaceholderText(
                      dictionary.az.photoGalleryHeader
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
          <Tabs.TabPane tab="Az" key="Az">
            {renderForm()}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Eng" key="Eng">
            {renderForm()}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Ru" key="Ru">
            {renderForm()}
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Card>
  );
}

export default WebsiteTitles;
