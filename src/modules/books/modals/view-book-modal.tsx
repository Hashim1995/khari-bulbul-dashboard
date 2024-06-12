import TokenizedImage from '@/components/display/image';
import { dictionary } from '@/utils/constants/dictionary';
import { getLanguageName } from '@/utils/functions/functions';
import { Button, Card, Col, Modal, Row, Typography } from 'antd';
import { Dispatch, SetStateAction } from 'react';

import { IBooksItem } from '../models';

interface IViewBookProps {
  selectedItem: IBooksItem;
  showViewBookModal: boolean;
  setShowViewBookModal: Dispatch<SetStateAction<boolean>>;
}

function ViewBook({
  setShowViewBookModal,
  selectedItem,
  showViewBookModal
}: IViewBookProps) {
  const { Text, Title } = Typography;
  const handleClose = () => {
    setShowViewBookModal(false);
  };

  const {
    author,
    // image
    description,
    coverPhoto,
    isActive,
    name,
    price,
    language,
    showOnFirstScreen
  } = selectedItem;

  return (
    <Modal
      width={700}
      destroyOnClose
      style={{ top: 20 }}
      title={dictionary.az.book}
      open={showViewBookModal}
      onCancel={handleClose}
      cancelText={dictionary.az.closeBtn}
      okText={dictionary.az.save}
      className="generalModal"
      footer={[
        <Button type="default" key="cancel" onClick={handleClose}>
          {dictionary.az.closeBtn}
        </Button>
      ]}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <TokenizedImage
            useCach
            tokenized
            imgType="common"
            preview
            style={{ width: 672, height: 300, objectFit: 'cover' }}
            src={coverPhoto.fileUrl ?? null}
          />
        </Col>
        <Col span={24}>
          <Card>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Title className="m-0" level={3}>
                  {name ?? dictionary.az.noDataText}
                </Title>
              </Col>
              <Col span={24}>
                <Text type="secondary" strong>
                  {dictionary.az.author}:
                </Text>
                <Text style={{ marginLeft: 8 }}>
                  {author ?? dictionary.az.noDataText}
                </Text>
              </Col>

              <Col span={24}>
                <Text type="secondary" strong>
                  {dictionary.az.price}:
                </Text>
                <Text style={{ marginLeft: 8 }}>
                  {' '}
                  {price ?? dictionary.az.noDataText} AZN{' '}
                </Text>
              </Col>

              <Col span={24}>
                <Text type="secondary" strong>
                  {dictionary.az.language}:
                </Text>
                <Text style={{ marginLeft: 8 }}>
                  {typeof language === 'number'
                    ? getLanguageName(language)
                    : dictionary.az.noDataText}
                </Text>
              </Col>

              {!isActive && (
                <Col span={24}>
                  <Text type="secondary" strong>
                    {dictionary.az.status}:
                  </Text>
                  <Text style={{ marginLeft: 8 }}>
                    {dictionary.az.deactivated}
                  </Text>
                </Col>
              )}

              <Col span={24}>
                <Text type="secondary" strong>
                  {dictionary.az.showOnFirstScreen}:
                </Text>
                <Text style={{ marginLeft: 8 }}>
                  {showOnFirstScreen
                    ? dictionary.az.yesTxt
                    : dictionary.az.noTxt}
                </Text>
              </Col>

              <Col span={24}>
                <Text type="secondary" strong>
                  {dictionary.az.description}:
                </Text>
                <Text style={{ marginLeft: 8 }}>
                  {description ?? dictionary.az.noDataText}
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
}

export default ViewBook;
