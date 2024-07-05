import AppHandledButton from '@/components/display/button/handle-button';
import AppHandledInput from '@/components/forms/input/handled-input';
import { IGlobalResponse } from '@/models/common';
import { SettingssServices } from '@/services/settings-services/settings-service';
import { dictionary } from '@/utils/constants/dictionary';
import { inputPlaceholderText } from '@/utils/constants/texts';
import { Card, Col, Collapse, Form, Row, Space, Spin, Typography, UploadFile } from 'antd';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import AppFileUpload from '@/components/forms/file-upload';
import { tokenizeImage } from '@/utils/functions/functions';
import { IContactUs, IGetContactUsResponse } from '../models';

function ContactUs() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<IContactUs>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      facebook: '',
      instagram: '',
      website: ''
    }
  });

  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any>([]);
  const [skeleton, setSkeleton] = useState(true);

  const fetchData = async () => {
    setIsFormSubmiting(true);
    // Use the staff service to get a single staff item by its ID.
    const res: IGetContactUsResponse =
      await SettingssServices.getInstance().getContactUs();
    // Extract permission values and handle cases where they may be an array or a single value.

    if (res?.isSuccess) {
      // If the data fetch is successful, populate the related form fields.
      setValue('email', res?.data?.email ?? '');
      setValue('facebook', res?.data?.facebook ?? '');
      setValue('instagram', res?.data?.instagram ?? '');
      setValue('website', res?.data?.website ?? '');
      setValue('coverPhoto', res?.data?.coverPhoto.id ?? null);

      const fetchDataPhoto = async () => {
        const file = res?.data?.coverPhoto;
  
        if (file) {
          const tokenizedFile = await tokenizeImage(file);
          setFileList([tokenizedFile]);
        }
      };
  
      fetchDataPhoto();
      
      setSkeleton(false);
    }
    setIsFormSubmiting(false);
  };

  const onSubmit: SubmitHandler<IContactUs> = async (data: IContactUs) => {
    setIsFormSubmiting(true);

    try {
      const payload = {
        website: data?.website,
        facebook: data?.facebook,
        instagram: data?.instagram,
        email: data?.email,
        coverPhoto: data?.coverPhoto
        ? data?.coverPhoto
        : fileList[0]?.id ?? null,
      };

      const res: IGlobalResponse =
        await SettingssServices.getInstance().updateContactUs(payload, () =>
          setIsFormSubmiting(false)
        );

      if (res.isSuccess) {
        toast.success(dictionary.az.successTxt);

        setRefreshComponent(z => !z);
      }
    } catch (error) {
      // Handle errors here, e.g., display an error message
      console.error('An error occurred:', error);
    } finally {
      // Whether success or failure, set isFormSubmitting to false and close the modal
      setIsFormSubmiting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshComponent]);

  return (
    <Card size="small" className="box box-margin-y ">
      <div className="generalFilter">
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
                {dictionary.az.contactUs}
              </Typography.Text>
            }
          >
            {!skeleton ? (
              <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
                <Row gutter={[16, 16]}>
                  <Col span={6}>
                    <AppHandledInput
                      label={dictionary.az.email}
                      name="email"
                      inputProps={{
                        id: 'email'
                      }}
                      control={control}
                      required={false}
                      inputType="text"
                      placeholder={inputPlaceholderText(dictionary.az.email)}
                      errors={errors}
                    />
                  </Col>

                  <Col span={6}>
                    <AppHandledInput
                      label={dictionary.az.website}
                      name="website"
                      inputProps={{
                        id: 'website'
                      }}
                      control={control}
                      required={false}
                      inputType="text"
                      placeholder={inputPlaceholderText(dictionary.az.website)}
                      errors={errors}
                    />
                  </Col>

                  <Col span={6}>
                    <AppHandledInput
                      label={dictionary.az.facebook}
                      name="facebook"
                      inputProps={{
                        id: 'facebook'
                      }}
                      control={control}
                      required={false}
                      inputType="text"
                      placeholder={inputPlaceholderText(dictionary.az.facebook)}
                      errors={errors}
                    />
                  </Col>

                  <Col span={6}>
                    <AppHandledInput
                      label={dictionary.az.instagram}
                      name="instagram"
                      inputProps={{
                        id: 'instagram'
                      }}
                      control={control}
                      required={false}
                      inputType="text"
                      placeholder={inputPlaceholderText(
                        dictionary.az.instagram
                      )}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                  <Form.Item label={dictionary.az.aboutUsImage}>
                  <AppFileUpload
                  listType="picture-card"
                  photoLabel={dictionary.az.aboutUsImage}
                  accept=".jpg, .jpeg, .png, .webp"
                  length={1}
                  defaultFileList={fileList}
                  getValues={(e: UploadFile[]) => {
                    if (e && e.length > 0) {
                      const selectedFile = e[0];
                      const fileData = selectedFile?.response?.data;
                      fileData && setValue('coverPhoto', fileData?.id);
                    } else {
                      setValue('coverPhoto', null);
                    }
                  }}
                  folderType={2}
                />
                </Form.Item>
                  </Col>
                </Row>
                <Row justify="end">
                  <div style={{ textAlign: 'right' }}>
                    <Space size="small">
                      <AppHandledButton
                        disabled={isFormSubmiting}
                        loading={isFormSubmiting}
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
      </div>
    </Card>
  );
}

export default ContactUs;
