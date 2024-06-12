import { Dispatch, SetStateAction, useState } from 'react';
import AppHandledButton from '@/components/display/button/handle-button';
import { dictionary } from '@/utils/constants/dictionary';
import { Col, Form, Modal, Row, UploadFile } from 'antd';
import { SubmitHandler, useForm } from 'react-hook-form';
import AppHandledInput from '@/components/forms/input/handled-input';
import AppHandledTextArea from '@/components/forms/text-area/handled-text-area';
import { inputPlaceholderText } from '@/utils/constants/texts';
// import { galleryTypeOptions } from '@/utils/constants/options';
import {
  inputValidationText,
  minLengthCheck
} from '@/utils/constants/validations';
import { showCloseConfirmationModal } from '@/utils/functions/functions';
import { useReadLocalStorage } from 'usehooks-ts';

import { IGlobalResponse } from '@/models/common';
import { toast } from 'react-toastify';
import AppFileUpload from '@/components/forms/file-upload';
import { GalleryServices } from '@/services/gallery-services/gallery-service';
import { IAddGalleryForm } from '../models';

interface IAddGalleryProps {
  showAddGalleryModal: boolean;
  setShowAddGalleryModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
}

function AddGalleryModal({
  setRefreshComponent,
  setShowAddGalleryModal,
  showAddGalleryModal
}: IAddGalleryProps) {
  const {
    formState: { errors },
    control,
    handleSubmit,
    setValue
  } = useForm<IAddGalleryForm>({
    defaultValues: {
      name: '',
      description: '',
      coverPhoto: ''
    },
    mode: 'onChange'
  });

  const darkMode = useReadLocalStorage('darkTheme');
  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);

  const handleClose = () => {
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      onClose: () => {
        // If the user confirms closing, hide the add Gallery modal.
        setShowAddGalleryModal(false);
      }
    });
  };

  const onSubmit: SubmitHandler<IAddGalleryForm> = async (
    data: IAddGalleryForm
  ) => {
    setIsFormSubmiting(true);

    // Create a payload object by extracting values from the data object, providing default values if they are undefined.
    const payload = {
      name: data.name,
      description: data.description,
      coverPhoto: data.coverPhoto
    };

    // Call the service to add a new country member and receive a response.
    const res: IGlobalResponse = await GalleryServices.getInstance().addGallery(
      payload,
      () => setIsFormSubmiting(false)
    );

    if (res.isSuccess) {
      // If the country member is successfully added, show a success toast message, hide the add country modal, and trigger a component refresh.
      toast.success(dictionary.az.successTxt);
      setShowAddGalleryModal(false);
      // Trigger a component refresh by toggling the `refreshComponent` state.
      setRefreshComponent(z => !z);
    }
    // If the country member is not successfully added, hide the add country modal and set isFormSubmitting to false.
    setShowAddGalleryModal(false);
    setIsFormSubmiting(false);
  };

  return (
    <Modal
      width={700}
      style={{ top: 20 }}
      destroyOnClose
      title={dictionary.az.addGallery}
      open={showAddGalleryModal}
      onCancel={handleClose}
      cancelText={dictionary.az.closeBtn}
      okText={dictionary.az.save}
      className="generalModal"
      footer={[
        <AppHandledButton
          form="add-gallery-modal-form"
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
        id="add-gallery-modal-form"
        layout="vertical"
        className="addPordductTabOneContainer"
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
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default AddGalleryModal;
