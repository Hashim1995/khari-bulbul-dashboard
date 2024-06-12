import { dictionary } from '@/utils/constants/dictionary';
import { Button, Card, Col, Modal, Row, Typography } from 'antd';
import { Dispatch, SetStateAction } from 'react';

import { IEmailsItem } from '../models';

interface IViewEmailProps {
  selectedItem: IEmailsItem;
  showViewEmailModal: boolean;
  setShowViewEmailModal: Dispatch<SetStateAction<boolean>>;
}

function ViewEmail({
  setShowViewEmailModal,
  selectedItem,
  showViewEmailModal
}: IViewEmailProps) {
  const { Text } = Typography;
  const handleClose = () => {
    setShowViewEmailModal(false);
  };

  const { email, fullname, message } = selectedItem;

  return (
    <Modal
      width={700}
      destroyOnClose
      style={{ top: 20 }}
      title={dictionary.az.message}
      open={showViewEmailModal}
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
          <Card>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text type="secondary" strong>
                  {dictionary.az.fullname}:
                </Text>
                <Text style={{ marginLeft: 8 }}>
                  {fullname ?? dictionary.az.noDataText}
                </Text>
              </Col>
              <Col span={24}>
                <Text type="secondary" strong>
                  {dictionary.az.email}:
                </Text>
                <Text style={{ marginLeft: 8 }}>
                  {email ?? dictionary.az.noDataText}
                </Text>
              </Col>

              <Col span={24}>
                <Text type="secondary" strong>
                  {dictionary.az.message}:
                </Text>
                <Text style={{ marginLeft: 8 }}>
                  {message ?? dictionary.az.noDataText}
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
}

export default ViewEmail;
