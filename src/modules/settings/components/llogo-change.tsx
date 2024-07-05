import AppHandledButton from '@/components/display/button/handle-button';
import { IGlobalResponse } from '@/models/common';
import { SettingssServices } from '@/services/settings-services/settings-service';
import { dictionary } from '@/utils/constants/dictionary';
import { Card, Col, Collapse, Form, Row, Space, Spin, Typography, UploadFile } from 'antd';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import AppFileUpload from '@/components/forms/file-upload';
import { tokenizeImage } from '@/utils/functions/functions';
import { IContactUs, IGetContactUsResponse } from '../models';

function ChangeLogo() {
  const {
   
    handleSubmit,
    setValue,
  } = useForm<IContactUs>({
    mode: 'onChange',
  });

  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any>([]);
  const [skeleton, setSkeleton] = useState(true);

  const fetchData = async () => {
    try {
      setIsFormSubmiting(true);
      // Use the staff service to get a single staff item by its ID.
      const res: IGetContactUsResponse = await SettingssServices.getInstance().getLogo();
      
      if (res?.isSuccess) {
        setValue('coverPhoto', res?.data?.coverPhoto.id ?? null);
  
        const fetchDataPhoto = async () => {
          const file = res?.data?.coverPhoto;
  
          if (file) {
            const tokenizedFile = await tokenizeImage(file);
            setFileList([tokenizedFile]);
          }
        };
  
        await fetchDataPhoto();
        setSkeleton(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsFormSubmiting(false);
      setSkeleton(false);
    }
  };
  

  const onSubmit: SubmitHandler<IContactUs> = async (data: IContactUs) => {
    setIsFormSubmiting(true);

    try {
      const payload = {
        coverPhoto: data?.coverPhoto
        ? data?.coverPhoto
        : fileList[0]?.id ?? null,
      };

      const res: IGlobalResponse =
        await SettingssServices.getInstance().updateLogo(payload, () =>
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
                {dictionary.az.logoImage}
              </Typography.Text>
            }
          >
            {!skeleton ? (
              <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
                <Row gutter={[16, 16]}>

                  <Col span={6}>
                  <Form.Item label={dictionary.az.logoImage}>
                  <AppFileUpload
                  listType="picture-card"
                  photoLabel={dictionary.az.logoImage}
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

export default ChangeLogo;
