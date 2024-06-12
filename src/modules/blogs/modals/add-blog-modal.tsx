import { Dispatch, SetStateAction, useRef, useState } from 'react';
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
// import { blogTypeOptions } from '@/utils/constants/options';
import {
  inputValidationText,
  minLengthCheck
} from '@/utils/constants/validations';
import { showCloseConfirmationModal } from '@/utils/functions/functions';
import { useReadLocalStorage } from 'usehooks-ts';

import { IGlobalResponse } from '@/models/common';
import { BlogsServices } from '@/services/blogs-services/blogs-service';
import { toast } from 'react-toastify';
import AppHandledCheckbox from '@/components/forms/checkbox/handled-checkbox';
import JoditEditor from 'jodit-react';
import { toastOptions } from '@/configs/global-configs';
import AppFileUpload from '@/components/forms/file-upload';
import AppHandledSelect from '@/components/forms/select/handled-select';
import { IAddBlogForm } from '../models';

interface IAddBlogProps {
  showAddBlogModal: boolean;
  setShowAddBlogModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
}

function AddBlogModal({
  setRefreshComponent,
  setShowAddBlogModal,
  showAddBlogModal
}: IAddBlogProps) {
  const {
    formState: { errors },
    control,
    handleSubmit,
    setValue
  } = useForm<IAddBlogForm>({
    defaultValues: {
      name: '',
      description: '',
      showOnFirstScreen: false,
      language: languagesOptions[0]
    },
    mode: 'onChange'
  });

  const darkMode = useReadLocalStorage('darkTheme');
  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);
  const editor = useRef(null);
  const [content, setContent] = useState('');

  const handleClose = () => {
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      onClose: () => {
        // If the user confirms closing, hide the add Blog modal.
        setShowAddBlogModal(false);
      }
    });
  };

  const onSubmit: SubmitHandler<IAddBlogForm> = async (data: IAddBlogForm) => {
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
        language:
          typeof data?.language === 'object' && data.language !== null
            ? data.language.value
            : data.language
      };

      if (content?.length < 50) {
        toast.warning(
          minLengthCheck(dictionary.az.content, '50'),
          toastOptions
        );
        setIsFormSubmiting(false);
        return;
      }
      const res: IGlobalResponse = await BlogsServices.getInstance().addBlog(
        payload,
        () => setIsFormSubmiting(false)
      );

      if (res.isSuccess) {
        toast.success(dictionary.az.successTxt);
        setShowAddBlogModal(false);
        setRefreshComponent(z => !z);
      }
      setShowAddBlogModal(false);
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
      title={dictionary.az.addBlog}
      open={showAddBlogModal}
      onCancel={handleClose}
      cancelText={dictionary.az.closeBtn}
      okText={dictionary.az.save}
      className="generalModal"
      footer={[
        <AppHandledButton
          form="add-blog-modal-form"
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
        id="add-blog-modal-form"
        layout="vertical"
        className="addPordductTabOneContainer"
        onFinish={handleSubmit(onSubmit)}
      >
        <Row gutter={16}>
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
              <Form.Item label={dictionary.az.blogPhoto}>
                <AppFileUpload
                  listType="picture-card"
                  photoLabel={dictionary.az.blogPhoto}
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

export default AddBlogModal;
