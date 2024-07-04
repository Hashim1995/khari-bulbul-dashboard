import { Dispatch, SetStateAction, useRef, useState } from 'react';
import AppHandledButton from '@/components/display/button/handle-button';
import { dictionary } from '@/utils/constants/dictionary';
import { Col, Form, Modal, Row, UploadFile } from 'antd';
import { SubmitHandler, useForm } from 'react-hook-form';
import AppHandledInput from '@/components/forms/input/handled-input';
import AppHandledTextArea from '@/components/forms/text-area/handled-text-area';
import {
  inputPlaceholderText,
} from '@/utils/constants/texts';
// import { eventTypeOptions } from '@/utils/constants/options';
import {
  inputValidationText,
  minLengthCheck
} from '@/utils/constants/validations';
import { showCloseConfirmationModal } from '@/utils/functions/functions';
import { useReadLocalStorage } from 'usehooks-ts';

import { IGlobalResponse } from '@/models/common';
import { EventsServices } from '@/services/events-services/events-service';
import { toast } from 'react-toastify';
import AppHandledCheckbox from '@/components/forms/checkbox/handled-checkbox';
import JoditEditor from 'jodit-react';
import { toastOptions } from '@/configs/global-configs';
import AppFileUpload from '@/components/forms/file-upload';
import { languagesOptionsWithIcons } from '@/modules/blogs/modals/add-blog-modal';
import AppHandledSelect from '@/components/forms/select/handled-select';
import dayjs from 'dayjs';
import AppHandledDate from '@/components/forms/date/handled-date';
import AppHandledRadio from '@/components/forms/radio/handled-radio';
import { IAddEventForm } from '../models';

interface IAddEventProps {
  showAddEventModal: boolean;
  setShowAddEventModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
}

function AddEventModal({
  setRefreshComponent,
  setShowAddEventModal,
  showAddEventModal
}: IAddEventProps) {
  const {
    formState: { errors },
    control,
    handleSubmit,
    setValue,
    watch,
  } = useForm<IAddEventForm>({
    defaultValues: {
      name: '',
      description: '',
      showOnFirstScreen: false,
      language: languagesOptionsWithIcons[0].value,
      postType: 2
    },
    mode: 'onChange'
  });

  const darkMode = useReadLocalStorage('darkTheme');
  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const nowOrLaterValue = watch('nowOrLater'); 

  const handleClose = () => {
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      onClose: () => {
        // If the user confirms closing, hide the add Event modal.
        setShowAddEventModal(false);
      }
    });
  };

  const onSubmit: SubmitHandler<IAddEventForm> = async (
    data: IAddEventForm
  ) => {
    setIsFormSubmiting(true);

    try {
      // Create a payload object by extracting values from the data object, providing default values if they are undefined.
      const payload = {
        name: data.name,
        content: data.description,
        description: content, // the reason why content and description are switched is due to backend developer
        showOnFirstScreen: data.showOnFirstScreen,
        coverPhoto: data.coverPhoto,
        isActive: true,
        postType: data?.postType,
        nowOrLater: data?.nowOrLater,
        language:
        typeof data?.language === 'object' && data.language !== null
          ? data.language.value
          : data.language,
          plannedDate: data.nowOrLater === 2 && data.plannedDate ?   dayjs(data?.plannedDate).format('YYYY-MM-DDTHH:mm') :   dayjs(Date.now()).format('YYYY-MM-DDTHH:mm')
  
      };

      if (content?.length < 50) {
        toast.warning(
          minLengthCheck(dictionary.az.content, '50'),
          toastOptions
        );
        setIsFormSubmiting(false);
        return;
      }
      const res: IGlobalResponse = await EventsServices.getInstance().addEvent(
        payload,
        () => setIsFormSubmiting(false)
      );

      if (res.isSuccess) {
        toast.success(dictionary.az.successTxt);
        setShowAddEventModal(false);
        setRefreshComponent(z => !z);
      }
      setShowAddEventModal(false);
      setIsFormSubmiting(false);
    } catch (error) {
      setIsFormSubmiting(false);
    }
  };

  return (
    <Modal
      width={900}
      style={{ top: 20 }}
      destroyOnClose
      title={dictionary.az.addEvent}
      open={showAddEventModal}
      onCancel={handleClose}
      cancelText={dictionary.az.closeBtn}
      okText={dictionary.az.save}
      className="generalModal"
      footer={[
        <AppHandledButton
          form="add-event-modal-form"
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
        id="add-event-modal-form"
        layout="vertical"
        className="addPordductTabOneContainer"
        onFinish={handleSubmit(onSubmit)}
      >
        <Row gutter={[16, 16]}>
        <Col span={2.5}>
            <AppHandledSelect
              label={dictionary.az.language}
              name="language"
              control={control}
              errors={errors}
              selectProps={{
                // defaultValue: languagesOptions[0],
                id: 'language',
                className: 'w-full',
                style: {display: 'flex', alignContent: 'center', justifyContent: 'center'},
                options: languagesOptionsWithIcons
              }}
            />
          </Col>
          
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
              <Form.Item label={dictionary.az.eventPhoto}>
                <AppFileUpload
                  listType="picture-card"
                  photoLabel={dictionary.az.eventPhoto}
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
            </Col>
            <Col span={24}>
            <AppHandledCheckbox
              label={dictionary.az.showOnFirstScreen}
              name="showOnFirstScreen"
              control={control}
              formItemProps={{
                labelCol: { span: 6 },
                wrapperCol: { span: 18 }
              }}
              errors={errors}
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
                errors={errors}
                placeholder={dictionary.az.ddmmyyyyHhMm}
                formItemProps={{
                  labelAlign: 'left',
                  labelCol: { span: 8, sm: 12, md: 12, lg: 12 },
                  style: { fontWeight: 'bolder' }
                }}

                required
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
                }}/>)
              }
              </Col>
              <Col span={24}>
            <JoditEditor
              ref={editor}
              value={content}
              onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
              onChange={() => {}}
            />
      </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default AddEventModal;
