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
import { EventsServices } from '@/services/events-services/events-service';
import { toast } from 'react-toastify';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import AppHandledTextArea from '@/components/forms/text-area/handled-text-area';
import AppHandledCheckbox from '@/components/forms/checkbox/handled-checkbox';
import JoditEditor from 'jodit-react';
import { toastOptions } from '@/configs/global-configs';
import AppFileUpload from '@/components/forms/file-upload';
import { IAddEventForm, IEventsItem } from '../models';

interface IUpdateEventProps {
  selectedItem: IEventsItem;
  showUpdateEventModal: boolean;
  setShowUpdateEventModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
}

function EditBookModal({
  setRefreshComponent,
  setShowUpdateEventModal,
  showUpdateEventModal,
  selectedItem
}: IUpdateEventProps) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<IAddEventForm>({
    defaultValues: {
      name: '',
      description: ''
    },
    mode: 'onChange'
  });

  const { id, name, description, content, showOnFirstScreen, coverPhoto } =
    selectedItem;

  const darkMode = useReadLocalStorage('darkTheme');
  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);
  const editor = useRef(null);
  const [contentState, setContentState] = useState('');
  const [fileList, setFileList] = useState<any>([]);

  const handleClose = () => {
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      onClose: () => {
        // If the user confirms closing, hide the add Event modal.
        setShowUpdateEventModal(false);
      }
    });
  };

  const onSubmit: SubmitHandler<IAddEventForm> = async (
    data: IAddEventForm
  ) => {
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
        postType: 2
      };

      if (contentState?.length < 50) {
        toast.warning(
          minLengthCheck(dictionary.az.content, '50'),
          toastOptions
        );
        setIsFormSubmiting(false);
        setShowUpdateEventModal(true);
        return;
      }

      const res: IGlobalResponse =
        await EventsServices.getInstance().updateEvent(payload, () =>
          setIsFormSubmiting(false)
        );

      if (res.isSuccess) {
        toast.success(dictionary.az.successTxt);
        setShowUpdateEventModal(false);
        setRefreshComponent(z => !z);
      }
    } catch (error) {
      toast.error(dictionary.az.errorOccurred, toastOptions);
    } finally {
      // Whether success or failure, set isFormSubmitting to false and close the modal
      setIsFormSubmiting(false);
    }
  };

  useEffect(() => {
    setValue('name', name ?? '');
    setValue('description', content ?? '');
    setValue('showOnFirstScreen', showOnFirstScreen ?? '');
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
      title={dictionary.az.updateEvent}
      open={showUpdateEventModal}
      onCancel={handleClose}
      cancelText={dictionary.az.closeBtn}
      okText={dictionary.az.save}
      className="generalModal"
      footer={[
        <AppHandledButton
          form="update-event-modal-form"
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
        id="update-event-modal-form"
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
                  rows: 3
                }}
              />
            </div>
            <div className="pb-10">
              <Form.Item label={dictionary.az.eventPhoto}>
                <AppFileUpload
                  listType="picture-card"
                  photoLabel={dictionary.az.eventPhoto}
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
            </div>
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

export default EditBookModal;
