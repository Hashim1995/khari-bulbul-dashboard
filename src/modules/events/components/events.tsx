import { dictionary } from '@/utils/constants/dictionary';
import { useState, useRef, useEffect } from 'react';
import AppHandledButton from '@/components/display/button/handle-button';
import {
  Breadcrumb,
  Card,
  Dropdown,
  MenuProps,
  Row,
  Space,
  Spin,
  Switch,
  Tooltip,
  Typography,
  theme
} from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined , DownOutlined} from '@ant-design/icons';
import { EventsServices } from '@/services/events-services/events-service';
import { AiFillDelete, AiFillEdit, AiOutlinePlus } from 'react-icons/ai';
import {
  getLanguageName,
  showCloseConfirmationModal
} from '@/utils/functions/functions';
import { ColumnsType } from 'antd/es/table';
import { toast } from 'react-toastify';
import { IGlobalResponse } from '@/models/common';
import { useReadLocalStorage } from 'usehooks-ts';
import AppHandledTable from '@/components/display/table';
import dayjs from 'dayjs';
import { IGetEventsResponse, IEventsItem } from '../models';
import AddEventModal from '../modals/add-event-modal';
import EditEventModal from '../modals/edit-event-modal';

function Events() {
  // const {
  //   reset,
  //   control,
  //   handleSubmit,
  //   formState: { errors }
  // } = useForm<IEventsFilter>({
  //   mode: 'onChange',
  //   defaultValues: {
  //     name: '',
  //     content: '',
  //     description: '',
  //     isActive: null
  //   }
  // });

  const { useToken } = theme;
  const { token } = useToken();

  const darkMode = useReadLocalStorage('darkTheme');
  const [selectedItem, setSelectedItem] = useState<IEventsItem>();
  const [showAddEventModal, setShowAddEventModal] = useState<boolean>(false);
  const [showUpdateEventModal, setShowUpdateEventModal] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [eventsData, setEventsData] = useState<IEventsItem[] | null>(null);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const forceUpdate = useRef<number>(0);
  const [language, setLanguage] = useState<number>(1);

  const fetchEventsList = async () => {
    try {
      setLoading(true);
      const res: IGetEventsResponse =
        await EventsServices.getInstance().getAllEvents([
          { name: 'offset', value: page },
          { name: 'language', value: language }
        ]);
      if (res?.isSuccess) {
        setEventsData(res?.data?.data);
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

  const handleEditClick = (raw: IEventsItem) => {
    setSelectedItem(raw);
    setShowUpdateEventModal(true);
  };

  const deleteEvent = async (id: number) => {
    try {
      setLoading(true);
      const res: IGlobalResponse =
        await EventsServices.getInstance().deleteEvent(id);
      if (res?.isSuccess) {
        toast.success(dictionary.az.successTxt);
        fetchEventsList();
      }
    } catch (error) {
      console.error('error', error);
      toast.error(dictionary.az.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (raw: IEventsItem) => {
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      titleText: dictionary.az.confirmTitle,
      descriptionText: dictionary.az.deleteModal,
      okText: dictionary.az.yesTxt,
      onClose: () => {
        deleteEvent(raw?.id);
      }
    });
  };

  const onChangeStatus = async (id: number) => {
    try {
      setLoading(true);

      const res: IGlobalResponse =
        await EventsServices.getInstance().changeStatus(id);

      if (res?.isSuccess) {
        setLoading(false);
        setRefreshComponent(!refreshComponent);
        toast.success(dictionary.az.statusSuccessMessage);
      } else {
        setLoading(false);
      }
    } catch (error) {
      // Handle any errors here
      console.error('An error occurred:', error);
      setLoading(false); // Make sure loading state is reset in case of error
    }
  };

  const renderEllipsisText = (record: string) => (
    <Typography.Paragraph
      style={{ margin: 0 }}
      ellipsis={{ rows: 2, tooltip: record }}
    >
      {record}
    </Typography.Paragraph>
  );

  const columns: ColumnsType<IEventsItem> = [
    {
      title: dictionary.az.name,
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: record => renderEllipsisText(record)
    },
    {
      title: dictionary.az.content,
      dataIndex: 'content',
      key: 'content',
      width: '40%',
      render: record => renderEllipsisText(record)
    },
    {
      title: dictionary.az.language,
      dataIndex: 'language',
      key: 'language',
      render: record => renderEllipsisText(getLanguageName(record ?? 1))
    },
    {
      title: dictionary.az.sharedDate,
      dataIndex: 'plannedDate',
      key: 'plannedDate',
      render: (date: string) => {
        const formattedDate = dayjs(date).format('DD.MM.YYYY HH:mm');
        return renderEllipsisText(formattedDate);
      }
    },

    {
      title: dictionary.az.status,
      dataIndex: 'isActive',
      key: 'isActive',
      render: (record: boolean, raw: IEventsItem) => (
        <Tooltip placement="top" title="Statusu dəyiş">
          <Switch checked={record} onChange={() => onChangeStatus(raw?.id)} />
        </Tooltip>
      )
    },
    {
      dataIndex: '',
      key: 'action',
      width: 130,
      align: 'right',
      render: (_, raw: IEventsItem) => (
        <Space size="small" align={'center'}>
          <>
            <Tooltip placement="top" title={dictionary.az.edit}>
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
            </Tooltip>
            <Tooltip placement="top" title={dictionary.az.delete}>
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
            </Tooltip>
          </>
        </Space>
      )
    }
  ];


  useEffect(() => {
    fetchEventsList();
  }, [page, refreshComponent, language]);

  const languagesOptionsWithIcons: MenuProps['items'] = [
    {
      label: 'Az',
      key: 1
    },
    {
      label: 'Eng',
      key: 2
    },
    {
      label: 'De',
      key: 3
    }
  ];

  const handleMenuClick: MenuProps['onClick'] = e => {
    if (e?.key === '1') {
      setLanguage(1);
    } else if (e?.key === '2') {
      setLanguage(2);
    } else if (e?.key === '3') {
      setLanguage(3);
    }
  };

  const menuProps = {
    items: languagesOptionsWithIcons,
    onClick: handleMenuClick
  };

  return (
    <div className="eventsContainer">
      <Card size="small" className="box box-margin-y">
        <Row justify="space-between" align="middle">
        <Space size={"large"}>
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
                title: dictionary.az.events
              },
              {
                title: dictionary.az.alreadyPublished
              }
            ]}
          />
              <Dropdown menu={menuProps} trigger={['click']}>
              <AppHandledButton
                style={{
                  borderColor: token.colorPrimary,
                  color: token.colorPrimaryText,
                  width: '80px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                type="default"
              >
                <span
                  style={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {getLanguageName(language)}
                </span>
                <DownOutlined rev={undefined} />
              </AppHandledButton>
            </Dropdown>
            </Space>
          <Tooltip placement="right" title={dictionary.az.addBtn}>
            <AppHandledButton
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              loading={loading}
              onClick={() => {
                setShowAddEventModal(true);
              }}
              icon={<AiOutlinePlus />}
            />
          </Tooltip>
        </Row>
      </Card>

      <Spin size="large" spinning={loading}>
        <AppHandledTable
          columns={columns}
          data={eventsData}
          currentPage={page}
          totalPage={totalPage}
          onChangePage={(e: number) => setCurrentPage(e)}
          key={forceUpdate.current}
          rowKey="id"
        />
      </Spin>

      {showAddEventModal && (
        <AddEventModal
          setShowAddEventModal={setShowAddEventModal}
          setRefreshComponent={setRefreshComponent}
          showAddEventModal={showAddEventModal}
        />
      )}
      {showUpdateEventModal && selectedItem && (
        <EditEventModal
          selectedItem={selectedItem}
          setShowUpdateEventModal={setShowUpdateEventModal}
          setRefreshComponent={setRefreshComponent}
          showUpdateEventModal={showUpdateEventModal}
        />
      )}
    </div>
  );
}

export default Events;
