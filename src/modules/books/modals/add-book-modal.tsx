/* eslint-disable jsx-a11y/media-has-caption */
import { Dispatch, SetStateAction, useState } from 'react';
import AppHandledButton from '@/components/display/button/handle-button';
import { dictionary } from '@/utils/constants/dictionary';
import { Col, Form, Modal, Row, UploadFile } from 'antd';
import { SubmitHandler, useForm } from 'react-hook-form';
import AppHandledInput from '@/components/forms/input/handled-input';
import AppHandledTextArea from '@/components/forms/text-area/handled-text-area';
import {
  inputPlaceholderText,
  languagesOptions
} from '@/utils/constants/texts';
// import { bookTypeOptions } from '@/utils/constants/options';
import {
  inputValidationText,
  minLengthCheck
} from '@/utils/constants/validations';
import { showCloseConfirmationModal } from '@/utils/functions/functions';
import { useReadLocalStorage } from 'usehooks-ts';

import { IGlobalResponse } from '@/models/common';
import { BooksServices } from '@/services/books-services/books-service';
import { toast } from 'react-toastify';
import AppFileUpload from '@/components/forms/file-upload';
import AppHandledCheckbox from '@/components/forms/checkbox/handled-checkbox';
import AppHandledSelect from '@/components/forms/select/handled-select';
import { IAddBookForm } from '../models';

interface IAddBookProps {
  showAddBookModal: boolean;
  setShowAddBookModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
}

function AddBookModal({
  setRefreshComponent,
  setShowAddBookModal,
  showAddBookModal
}: IAddBookProps) {
  const {
    formState: { errors },
    control,
    handleSubmit,
    setValue,
    watch
  } = useForm<IAddBookForm>({
    defaultValues: {
      name: '',
      author: '',
      description: '',
      price: null,
      coverPhoto: '',
      audioFile: null,
      pdfFile: null,
      showOnFirstScreen: false,
      language: languagesOptions[0]
    },
    mode: 'onChange'
  });

  const darkMode = useReadLocalStorage('darkTheme');
  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);

  const handleClose = () => {
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      onClose: () => {
        // If the user confirms closing, hide the add Book modal.
        setShowAddBookModal(false);
      }
    });
  };

  const onSubmit: SubmitHandler<IAddBookForm> = async (data: IAddBookForm) => {
    setIsFormSubmiting(true);

    // Create a payload object by extracting values from the data object, providing default values if they are undefined.
    const payload = {
      name: data.name,
      author: data.author,
      description: data.description,
      price: data.price,
      coverPhoto: data.coverPhoto,
      audioFile: data.audioFile,
      pdfFile: data.pdfFile,
      showOnFirstScreen: data.showOnFirstScreen,
      language:
        typeof data?.language === 'object' && data.language !== null
          ? data.language.value
          : data.language
    };

    // Call the service to add a new country member and receive a response.
    const res: IGlobalResponse = await BooksServices.getInstance().addBook(
      payload,
      () => setIsFormSubmiting(false)
    );

    if (res.isSuccess) {
      // If the country member is successfully added, show a success toast message, hide the add country modal, and trigger a component refresh.
      toast.success(dictionary.az.successTxt);
      setShowAddBookModal(false);
      // Trigger a component refresh by toggling the `refreshComponent` state.
      setRefreshComponent(z => !z);
    }
    // If the country member is not successfully added, hide the add country modal and set isFormSubmitting to false.
    setShowAddBookModal(false);
    setIsFormSubmiting(false);
  };

  console.log(watch('audioFile'));

  return (
    <Modal
      width={700}
      style={{ top: 20 }}
      destroyOnClose
      title={dictionary.az.addBook}
      open={showAddBookModal}
      onCancel={handleClose}
      cancelText={dictionary.az.closeBtn}
      okText={dictionary.az.save}
      className="generalModal"
      footer={[
        <AppHandledButton
          form="add-book-modal-form"
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
        id="add-book-modal-form"
        layout="vertical"
        className="addPordductTabOneContainer"
        onFinish={handleSubmit(onSubmit)}
      >
        <Row gutter={16}>
          <Col span={3}>
            <AppHandledSelect
              label={dictionary.az.language}
              name="language"
              required
              control={control}
              errors={errors}
              selectProps={{
                // defaultValue: languagesOptions[0],
                id: 'language',
                className: 'w-full',
                options: languagesOptions
              }}
            />
          </Col>
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
              <AppHandledInput
                label={dictionary.az.author}
                name="author"
                inputProps={{
                  id: 'Author'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(dictionary.az.author)
                  },
                  minLength: {
                    value: 3,
                    message: minLengthCheck(dictionary.az.author, '3')
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText(dictionary.az.author)}
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
              <AppHandledInput
                label={dictionary.az.price}
                name="price"
                inputProps={{
                  id: 'Price'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(dictionary.az.price)
                  }
                }}
                required
                control={control}
                inputType="number"
                placeholder={inputPlaceholderText(dictionary.az.price)}
                errors={errors}
              />
            </div>
            <div className="pb-10">
              <AppHandledCheckbox
                label={dictionary.az.showOnFirstScreen}
                name="showOnFirstScreen"
                control={control}
                errors={errors}
                formItemProps={{
                  labelCol: { span: 7 },
                  wrapperCol: { span: 17 }
                }}
              />
            </div>
            <div className="pb-10">
              <Form.Item label={dictionary.az.coverPhoto}>
                <AppFileUpload
                  listType="picture-card"
                  photoLabel={dictionary.az.bookPhoto}
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

            <div className="pb-10">
              <Form.Item label={dictionary.az.uploadAudio}>
                <AppFileUpload
                  listType="picture-card"
                  photoLabel={dictionary.az.uploadAudio}
                  accept=".mp3"
                  length={1}
                  getValues={(e: UploadFile[]) => {
                    if (e && e.length > 0) {
                      const selectedFile = e[0];
                      const fileData = selectedFile?.response?.data;

                      fileData && setValue('audioFile', fileData?.id);
                    } else {
                      setValue('audioFile', null);
                    }
                  }}
                  folderType={3}
                />
              </Form.Item>
            </div>

            <div className="pb-10">
              <Form.Item label={dictionary.az.uploadPdf}>
                <AppFileUpload
                  listType="picture-card"
                  photoLabel={dictionary.az.uploadPdf}
                  accept=".pdf"
                  length={1}
                  getValues={(e: UploadFile[]) => {
                    if (e && e.length > 0) {
                      const selectedFile = e[0];
                      const fileData = selectedFile?.response?.data;
                      fileData && setValue('pdfFile', fileData?.id);
                    } else {
                      setValue('pdfFile', null);
                    }
                  }}
                  folderType={1}
                />
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default AddBookModal;
