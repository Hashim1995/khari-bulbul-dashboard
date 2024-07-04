/* eslint-disable no-unused-vars */
import AppHandledButton from '@/components/display/button/handle-button';
import { IGlobalResponse } from '@/models/common';
import { dictionary } from '@/utils/constants/dictionary';
import { Col, Form, Modal, Row, UploadFile } from 'antd';
import { SubmitHandler, useForm } from 'react-hook-form';
import AppHandledInput from '@/components/forms/input/handled-input';
import { inputPlaceholderText } from '@/utils/constants/texts';
import {
  inputValidationText,
  minLengthCheck
} from '@/utils/constants/validations';
import { useReadLocalStorage } from 'usehooks-ts';
import {
  showCloseConfirmationModal,
  tokenizeImage
} from '@/utils/functions/functions';
import { BlogsServices } from '@/services/blogs-services/blogs-service';
import { toast } from 'react-toastify';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import AppHandledTextArea from '@/components/forms/text-area/handled-text-area';
import AppHandledCheckbox from '@/components/forms/checkbox/handled-checkbox';
import JoditEditor from 'jodit-react';
import { toastOptions } from '@/configs/global-configs';
import dayjs from 'dayjs';
import AppFileUpload from '@/components/forms/file-upload';
import AppHandledDate from '@/components/forms/date/handled-date';
import AppHandledRadio from '@/components/forms/radio/handled-radio';
import { IAddBlogForm, IBlogsItem } from '../models';

interface IUpdateBlogProps {
  selectedItem: IBlogsItem;
  showUpdateBlogModal: boolean;
  setShowUpdateBlogModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
}

function EditBlogModal({
  setRefreshComponent,
  setShowUpdateBlogModal,
  showUpdateBlogModal,
  selectedItem
}: IUpdateBlogProps) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<IAddBlogForm>({
    defaultValues: {
      name: selectedItem?.name,
      description: selectedItem?.content,
      showOnFirstScreen: selectedItem?.showOnFirstScreen,
      // coverPhoto: selectedItem?.coverPhoto,
      nowOrLater: selectedItem?.nowOrLater,
      // plannedDate: selectedItem?.plannedDate,
    },
    mode: 'onChange'
  });

  const { id, description, showOnFirstScreen,plannedDate, coverPhoto, } =
    selectedItem;

  const darkMode = useReadLocalStorage('darkTheme');
  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);
  const editor = useRef(null);
  const [contentState, setContentState] = useState('');
  const [fileList, setFileList] = useState<any>([]);
  const nowOrLaterValue = watch('nowOrLater'); 

  const handleClose = () => {
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      onClose: () => {
        // If the user confirms closing, hide the add Blog modal.
        setShowUpdateBlogModal(false);
      }
    });
  };

  const onSubmit: SubmitHandler<IAddBlogForm> = async (data: IAddBlogForm) => {
    setIsFormSubmiting(true);

    try {
      const payload = {
        id,
        name: data.name,
        content: data.description,
        description: contentState,
        showOnFirstScreen: data.showOnFirstScreen,
        coverPhoto: data?.coverPhoto
          ? data?.coverPhoto
          : fileList[0]?.id ?? null,
        postType: 1,
        nowOrLater: data?.nowOrLater,
        language:
        typeof data?.language === 'object' && data.language !== null
          ? data.language.value
          : data.language,
        plannedDate: data.nowOrLater === 2 && data.plannedDate ?   dayjs(data?.plannedDate).format('YYYY-MM-DDTHH:mm:ss') : null
      };

      if (contentState?.length < 50) {
        toast.warning(
          minLengthCheck(dictionary.az.content, '50'),
          toastOptions
        );
        setIsFormSubmiting(false);
        setShowUpdateBlogModal(true);
        return;
      }

      const res: IGlobalResponse = await BlogsServices.getInstance().updateBlog(
        payload,
        () => setIsFormSubmiting(false)
      );

      if (res.isSuccess) {
        toast.success(dictionary.az.successTxt);
        setShowUpdateBlogModal(false);
        setRefreshComponent(z => !z);
      }
    } catch (error) {
      toast.error(dictionary.az.errorOccurred, toastOptions);
    } finally {
      setIsFormSubmiting(false);
    }
  };

  useEffect(() => {
    if(plannedDate) {
      setValue('plannedDate', dayjs(plannedDate, 'YYYY.MM.DD HH:mm'))
    }
 
    setContentState(description);

    setValue('coverPhoto', coverPhoto.id ?? null);
    const fetchData = async () => {
      const file = coverPhoto;

      if (file) {
        const tokenizedFile = await tokenizeImage(file);
        setFileList([tokenizedFile]);
      }
    };

    fetchData();
  }, []);

  return (
    <Modal
      width={900}
      destroyOnClose
      style={{ top: 20 }}
      title={dictionary.az.updateNews}
      open={showUpdateBlogModal}
      onCancel={handleClose}
      cancelText={dictionary.az.closeBtn}
      okText={dictionary.az.save}
      className="generalModal"
      footer={[
        <AppHandledButton
          form="update-blog-modal-form"
          type="primary"
          key="submit"
          htmlType="submit"
          disabled={isFormSubmiting}
          loading={isFormSubmiting}
        >
          {dictionary.az.save}
        </AppHandledButton>
      ]}
    >
      <Form
        id="update-blog-modal-form"
        layout="vertical"
        className="updatePordductTabOneContainer"
        onFinish={handleSubmit(onSubmit)}
      >
        <Row gutter={[16, 16]}>
        <Col span={24}>
              <AppHandledInput
                label={dictionary.az.name}
                name="name"
                inputProps={{
                  id: 'Name'
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
            </Col>
            <Col span={24}>
              <AppHandledTextArea
                label={dictionary.az.description}
                name="description"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(dictionary.az.description)
                  },
                  minLength: {
                    value: 3,
                    message: minLengthCheck(dictionary.az.description, '3')
                  }
                }}
                required
                control={control}
                placeholder={inputPlaceholderText(dictionary.az.description)}
                errors={errors}
                textareaProps={{
                  size: 'large',
                  rows: 3
                }}
              />
            </Col>
            <Col span={24}>
              <Form.Item label={dictionary.az.newsPhoto}>
                <AppFileUpload
                  listType="picture-card"
                  photoLabel={dictionary.az.newsPhoto}
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
            <Col span={24}>
              <AppHandledCheckbox
                label={dictionary.az.showOnFirstScreen}
                defaultValue={showOnFirstScreen}
                name="showOnFirstScreen"
                required
                control={control}
                errors={errors}
                formItemProps={{
                  labelCol: { span: 6 },
                  wrapperCol: { span: 18 }
                }}
              />
            </Col>

            <Col span={24}>
              <AppHandledRadio
                label={dictionary.az.publish}
                name="nowOrLater"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(dictionary.az.publish)
                  }
                }}
                required
                errors={errors}
                isGroup
                options={[
                  { label: dictionary.az.now, value: 1 },
                  { label: dictionary.az.later, value: 2 }
                ]}
              />
            </Col>
            <Col span={24}>
              {nowOrLaterValue === 2 && (
                <AppHandledDate
                  label={dictionary.az.createdDate}
                  name="plannedDate"
                  control={control}    
                  rules={{
                    required: {
                      value: true,
                      message: inputValidationText(dictionary.az.createdDate)
                    }
                  }}
                  errors={errors}
                  required
                  placeholder={dictionary.az.ddmmyyyyHhMm}
                  formItemProps={{
                    labelAlign: 'left',
                    labelCol: { span: 8, sm: 12, md: 12, lg: 12 },
                    style: { fontWeight: 'bolder' }
                  }}
                  dateProps={{
                    allowClear: true,
                    showTime: {
                      format: 'HH:mm'
                    },
                    style: {
                      width: '100%'
                    },
                    format: 'YYYY.MM.DD HH:mm',
                    disabledDate: current => current && dayjs(current).isBefore(dayjs(), 'day'), 
                    disabledTime: (current : any) => ({
                      disabledHours: () => {
                        if (dayjs(current).isSame(dayjs(), 'day')) {
                          return [...Array(dayjs().hour()).keys()];
                        }
                        return [];
                      },
                      disabledMinutes: (selectedHour: number) => {
                        if (dayjs(current).isSame(dayjs(), 'day') && selectedHour === dayjs().hour()) {
                          return [...Array(dayjs().minute()).keys()];
                        }
                        return [];
                      },
                    }),
                  }}
                 
                />
              )}
            </Col>
              <Col span={24}>
                  <JoditEditor
              ref={editor}
              value={contentState}
              onBlur={newContent => setContentState(newContent)} // preferred to use only this option to update the content for performance reasons
              onChange={() => {}}
            />
              </Col>
          
        </Row>
      </Form>
    </Modal>
  );
}

export default EditBlogModal;
