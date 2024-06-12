import { dictionary } from '@/utils/constants/dictionary';
import { useState, useRef, useEffect } from 'react';
import AppHandledButton from '@/components/display/button/handle-button';
import { Breadcrumb, Card, Row, Space, Spin, Tooltip, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { AiFillEye } from 'react-icons/ai';
import { ColumnsType } from 'antd/es/table';
import AppHandledTable from '@/components/display/table';
// import AddEmailModal from '../modals/add-email-modal';
// import EditEmailModal from '../modals/edit-email-modal';
import { EmailsServices } from '@/services/emails-services/emails-service';
import ViewEmail from '../modals/view-email-modal';
import { IEmailsItem, IGetEmailsResponse } from '../models';

function Emails() {
  const [selectedItem, setSelectedItem] = useState<IEmailsItem>();
  // const [showAddEmailModal, setShowAddEmailModal] = useState<boolean>(false);
  // const [showUpdateEmailModal, setShowUpdateEmailModal] =
  //   useState<boolean>(false);
  const [showViewEmailModal, setShowViewEmailModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [emailsData, setEmailsData] = useState<IEmailsItem[] | null>(null);
  // const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const forceUpdate = useRef<number>(0);

  const fetchEmailsList = async () => {
    try {
      setLoading(true);
      const res: IGetEmailsResponse =
        await EmailsServices.getInstance().getAllEmails([
          { name: 'offset', value: page }
        ]);
      if (res?.isSuccess) {
        setEmailsData(res?.data?.data);
        setTotalPage(res?.data?.totalDataCount);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // const handleEditClick = (raw: IEmailsItem) => {
  //   setSelectedItem(raw);
  //   setShowUpdateEmailModal(true);
  // };

  const handleViewClick = (raw: IEmailsItem) => {
    setSelectedItem(raw);
    setShowViewEmailModal(true);
  };

  const renderEllipsisText = (record: string) => (
    <Typography.Paragraph
      style={{ margin: 0 }}
      ellipsis={{ rows: 2, tooltip: record }}
    >
      {record}
    </Typography.Paragraph>
  );

  const columns: ColumnsType<IEmailsItem> = [
    {
      title: dictionary.az.fullname,
      dataIndex: 'fullname',
      key: 'fullname',
      render: record => renderEllipsisText(record)
    },
    {
      title: dictionary.az.email,
      dataIndex: 'email',
      key: 'email',
      render: record => renderEllipsisText(record)
    },
    {
      title: dictionary.az.message,
      dataIndex: 'message',
      key: 'message',
      width: '40%',
      render: record => renderEllipsisText(record)
    },

    {
      dataIndex: '',
      key: 'action',
      width: 130,
      align: 'right',
      render: (_, raw: IEmailsItem) => (
        <Space size="small" align={'center'}>
          <>
            <Tooltip placement="top" title={dictionary.az.view}>
              <AppHandledButton
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                size="middle"
                icon={<AiFillEye />}
                onClick={() => handleViewClick(raw)}
              />
            </Tooltip>
            {/* <Tooltip placement="top" title={dictionary.az.edit}>
              <AppHandledButton
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                size="middle"
                icon={<AiFillEdit />}
                onClick={() => handleEditClick(raw)}
              />
            </Tooltip> */}
            {/* <Tooltip placement="top" title={dictionary.az.delete}>
              <AppHandledButton
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                size="middle"
                icon={<AiFillDelete />}
                onClick={() => handleDelete(raw)}
              />
            </Tooltip> */}
          </>
        </Space>
      )
    }
  ];

  useEffect(() => {
    fetchEmailsList();
  }, [page]);

  return (
    <div className="emailsContainer">
      <Card size="small" className="box box-margin-y">
        <Row justify="space-between" align="middle">
          <Breadcrumb
            items={[
              {
                title: (
                  <Link to="/home">
                    <HomeOutlined rev={undefined} />
                  </Link>
                )
              },
              {
                title: dictionary.az.receivedEmails
              }
            ]}
          />
          {/* <Tooltip placement="right" title={dictionary.az.addBtn}>
            <AppHandledButton
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              loading={loading}
              onClick={() => {
                setShowAddEmailModal(true);
              }}
              icon={<AiOutlinePlus />}
            />
          </Tooltip> */}
        </Row>
      </Card>
      <Spin size="large" spinning={loading}>
        <AppHandledTable
          columns={columns}
          data={emailsData}
          currentPage={page}
          totalPage={totalPage}
          onChangePage={(e: number) => setCurrentPage(e)}
          key={forceUpdate.current}
          rowKey="id"
        />
      </Spin>

      {showViewEmailModal && selectedItem && (
        <ViewEmail
          setShowViewEmailModal={setShowViewEmailModal}
          showViewEmailModal={showViewEmailModal}
          selectedItem={selectedItem}
        />
      )}
    </div>
  );
}

export default Emails;
