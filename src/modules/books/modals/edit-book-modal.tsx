/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/media-has-caption */
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
import { BooksServices } from '@/services/books-services/books-service';
import { toast } from 'react-toastify';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import AppFileUpload from '@/components/forms/file-upload';
import AppHandledTextArea from '@/components/forms/text-area/handled-text-area';
import AppHandledCheckbox from '@/components/forms/checkbox/handled-checkbox';
import { IAddBookForm, IBooksItem } from '../models';

interface IUpdateBookProps {
  selectedItem: IBooksItem;
  showUpdateBookModal: boolean;
  setShowUpdateBookModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
}

function EditBookModal({
  setRefreshComponent,
  setShowUpdateBookModal,
  showUpdateBookModal,
  selectedItem
}: IUpdateBookProps) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<IAddBookForm>({
    defaultValues: {
      name: '',
      author: '',
      description: '',
      price: null,
      coverPhoto: '',
      audioFile: null,
      pdfFile: null,
      showOnFirstScreen: null
    },
    mode: 'onChange'
  });

  const {
    id,
    name,
    author,
    description,
    price,
    coverPhoto,
    audioFile,
    pdfFile,
    showOnFirstScreen
  } = selectedItem;

  const darkMode = useReadLocalStorage('darkTheme');
  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);
  const [covertPhotoFileList, setCovertPhotoFileList] = useState<any>([]);
  const [pdfFileList, setPdfFileList] = useState<any>([]);
  const [audioFileList, setAudioFileList] = useState<any>([]);
  const handleClose = () => {
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      onClose: () => {
        // If the user confirms closing, hide the add Book modal.
        setShowUpdateBookModal(false);
      }
    });
  };

  const onSubmit: SubmitHandler<IAddBookForm> = async (data: IAddBookForm) => {
    setIsFormSubmiting(true);
    console.log(data);

    try {
      const payload = {
        id,
        name: data.name,
        author: data.author,
        description: data.description,
        price: data.price,
        showOnFirstScreen: Boolean(data.showOnFirstScreen),
        coverPhoto: data?.coverPhoto
          ? data?.coverPhoto
          : covertPhotoFileList[0]?.id ?? null,
        audioFile: data?.audioFile ? data?.audioFile : null,
        pdfFile: data?.pdfFile ? data?.pdfFile : null
      };

      const res: IGlobalResponse = await BooksServices.getInstance().updateBook(
        payload,
        () => setIsFormSubmiting(false)
      );

      if (res.isSuccess) {
        toast.success(dictionary.az.successTxt);
        setShowUpdateBookModal(false);
        setRefreshComponent(z => !z);
      }
    } catch (error) {
      // Handle errors here, e.g., display an error message
      console.error('An error occurred:', error);
    } finally {
      // Whether success or failure, set isFormSubmitting to false and close the modal
      setIsFormSubmiting(false);
      setShowUpdateBookModal(false);
    }
  };

  const reFetchTokenizedFiles = async (
    coverPhotoId: string,
    pdfId: string,
    audioId: string
  ) => {
    if (coverPhotoId) {
      try {
        const res = await tokenizeImage(coverPhotoId);
        setCovertPhotoFileList([res]);
      } catch (err) {
        console.log(err);
      }
    }
    if (pdfId) {
      try {
        const res = await tokenizeImage(pdfId);
        setPdfFileList([res]);
      } catch (err) {
        console.log(err);
      }
    }
    if (audioId) {
      try {
        const res = await tokenizeImage(audioId);
        setAudioFileList([res]);
      } catch (err) {
        console.log(err);
      }
    }
  };
  useEffect(() => {
    setValue('name', name ?? '');
    setValue('author', author ?? '');
    setValue('description', description ?? '');
    setValue('price', price ?? '');
    setValue('showOnFirstScreen', showOnFirstScreen ?? '');
    setValue('coverPhoto', coverPhoto?.id ?? null);
    // setValue('audioFile', audioFile?.id ?? null);
    setValue('pdfFile', pdfFile?.id ?? null);
  }, []);

  useEffect(() => {
    reFetchTokenizedFiles(coverPhoto, pdfFile, audioFile);
  }, [selectedItem]);

  return (
    <Modal
      width={700}
      destroyOnClose
      style={{ top: 20 }}
      title={dictionary.az.updateBook}
      open={showUpdateBookModal}
      onCancel={handleClose}
      cancelText={dictionary.az.closeBtn}
      okText={dictionary.az.save}
      className="generalModal"
      footer={[
        <AppHandledButton
          form="update-book-modal-form"
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
        id="update-book-modal-form"
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
                defaultValue={showOnFirstScreen}
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
                  defaultFileList={covertPhotoFileList}
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
                  accept=".mp3, .mpeg"
                  length={1}
                  defaultFileList={audioFileList}
                  getValues={(e: UploadFile[]) => {
                    if (e && e.length > 0) {
                      const selectedFile = e[0];
                      const fileData =
                        selectedFile?.response?.data ?? selectedFile;

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
                  defaultFileList={pdfFileList}
                  getValues={(e: UploadFile[]) => {
                    if (e && e.length > 0) {
                      const selectedFile = e[0];
                      const fileData =
                        selectedFile?.response?.data ?? selectedFile;
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

export default EditBookModal;
