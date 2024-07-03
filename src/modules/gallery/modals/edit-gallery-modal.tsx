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
import { toast } from 'react-toastify';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import AppFileUpload from '@/components/forms/file-upload';
import AppHandledTextArea from '@/components/forms/text-area/handled-text-area';
import { GalleryServices } from '@/services/gallery-services/gallery-service';
import { IAddGalleryForm, IGalleryItem } from '../models';

interface IUpdateGalleryProps {
  selectedItem: IGalleryItem;
  showUpdateGalleryModal: boolean;
  setShowUpdateGalleryModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
}

function EditBookModal({
  setRefreshComponent,
  setShowUpdateGalleryModal,
  showUpdateGalleryModal,
  selectedItem
}: IUpdateGalleryProps) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<IAddGalleryForm>({
    defaultValues: {
      name: '',
      description: '',
      coverPhoto: ''
    },
    mode: 'onChange'
  });

  const { id, name, description, coverPhoto } = selectedItem;

  const darkMode = useReadLocalStorage('darkTheme');
  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any>([]);

  const handleClose = () => {
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      onClose: () => {
        // If the user confirms closing, hide the add Gallery modal.
        setShowUpdateGalleryModal(false);
      }
    });
  };

  const onSubmit: SubmitHandler<IAddGalleryForm> = async (
    data: IAddGalleryForm
  ) => {
    setIsFormSubmiting(true);

    try {
      const payload = {
        id,
        name: data.name,
        description: data.description,
        coverPhoto: data?.coverPhoto
          ? data?.coverPhoto
          : fileList[0]?.id ?? null
      };

      const res: IGlobalResponse =
        await GalleryServices.getInstance().updateGallery(payload, () =>
          setIsFormSubmiting(false)
        );

      if (res.isSuccess) {
        toast.success(dictionary.az.successTxt);
        setShowUpdateGalleryModal(false);
        setRefreshComponent(z => !z);
      }
    } catch (error) {
      // Handle errors here, e.g., display an error message
      console.error('An error occurred:', error);
    } finally {
      // Whether success or failure, set isFormSubmitting to false and close the modal
      setIsFormSubmiting(false);
      setShowUpdateGalleryModal(false);
    }
  };

  useEffect(() => {
    setValue('name', name ?? '');
    setValue('description', description ?? '');
    setValue('coverPhoto', coverPhoto?.id ?? null);
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
      width={700}
      destroyOnClose
      style={{ top: 20 }}
      title={dictionary.az.updateGallery}
      open={showUpdateGalleryModal}
      onCancel={handleClose}
      cancelText={dictionary.az.closeBtn}
      okText={dictionary.az.save}
      className="generalModal"
      footer={[
        <AppHandledButton
          form="update-gallery-modal-form"
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
        id="update-gallery-modal-form"
        layout="vertical"
        className="updatePordductTabOneContainer"
        onFinish={handleSubmit(onSubmit)}
      >
        <Row gutter={16}>
          <Col span={24}>
            <div className="pb-10">
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
            </div>

            <div className="pb-10">
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
                  rows: 4
                }}
              />
            </div>

            <div className="pb-10">
              <Form.Item label={dictionary.az.galleryPhoto}>
                <AppFileUpload
                  listType="picture-card"
                  photoLabel={dictionary.az.galleryPhoto}
                  accept=".jpg, .jpeg, .png, .webp"
                  length={1}
                  defaultFileList={fileList}
                  getValues={(e: UploadFile[]) => {
                    if (e && e.length > 0) {
                      const selectedFile = e[0];

                      console.log(watch('coverPhoto'), 'selected')
                      const fileData = selectedFile?.response?.data;
                      fileData && setValue('coverPhoto', fileData?.id);
                    } else {
                      setValue('coverPhoto', null);
                    }
                  }}
                  folderType={2}
                />
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default EditBookModal;
