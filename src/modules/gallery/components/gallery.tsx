import { dictionary } from '@/utils/constants/dictionary';
import { useState, useRef, useEffect } from 'react';
import AppHandledButton from '@/components/display/button/handle-button';

import {
  Breadcrumb,
  Card,
  Row,
  Space,
  Spin,
  Switch,
  Tooltip,
  Typography,
  Image,
  ConfigProvider
} from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { GalleryServices } from '@/services/gallery-services/gallery-service';
import { AiFillDelete, AiFillEdit, AiOutlinePlus } from 'react-icons/ai';
import { showCloseConfirmationModal } from '@/utils/functions/functions';
import defaultImage from '@/assets/images/default-image.png';
import { ColumnsType } from 'antd/es/table';
import { toast } from 'react-toastify';
import { IGlobalResponse } from '@/models/common';
import { useReadLocalStorage } from 'usehooks-ts';
import AppHandledTable from '@/components/display/table';
import dayjs from 'dayjs';
import { IGetGalleryResponse, IGalleryItem } from '../models';
import AddGalleryModal from '../modals/add-gallery-modal';
import EditGalleryModal from '../modals/edit-gallery-modal';

function Gallery() {
  const darkMode = useReadLocalStorage('darkTheme');
  const [selectedItem, setSelectedItem] = useState<IGalleryItem>();
  const [showAddGalleryModal, setShowAddGalleryModal] =
    useState<boolean>(false);
  const [showUpdateGalleryModal, setShowUpdateGalleryModal] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [galleryData, setGalleryData] = useState<IGalleryItem[] | null>(null);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const forceUpdate = useRef<number>(0);

  const fetchGalleryList = async () => {
    try {
      setLoading(true);
      const res: IGetGalleryResponse =
        await GalleryServices.getInstance().getAllGallery([
          { name: 'offset', value: page }
        ]);
      if (res?.isSuccess) {
        setGalleryData(res?.data?.data);
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

  const handleEditClick = (raw: IGalleryItem) => {
    setSelectedItem(raw);
    setShowUpdateGalleryModal(true);
  };

  const deleteGallery = async (id: number) => {
    try {
      setLoading(true);
      const res: IGlobalResponse =
        await GalleryServices.getInstance().deleteGallery(id);
      if (res?.isSuccess) {
        toast.success(dictionary.az.successTxt);
        fetchGalleryList();
      }
    } catch (error) {
      console.error('error', error);
      toast.success(dictionary.az.successTxt);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (raw: IGalleryItem) => {
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      titleText: dictionary.az.confirmTitle,
      descriptionText: dictionary.az.deleteModal,
      okText: dictionary.az.yesTxt,
      onClose: () => {
        deleteGallery(raw?.id);
      }
    });
  };

  const onChangeStatus = async (id: number) => {
    try {
      setLoading(true);

      const res: IGlobalResponse =
        await GalleryServices.getInstance().changeStatus(id);

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

  const columns: ColumnsType<IGalleryItem> = [
    {
      title: dictionary.az.gallery,
      dataIndex: 'coverPhoto',
      key: 'coverPhoto',
      width: 50,
      render: record => (
        <ConfigProvider
          locale={{
            locale: 'az',
            Image: {
              preview: ''
            }
          }}
        >
          <Image
            style={{ objectFit: 'contain' }}
            height={70}
            width={70}
            src={record?.fileUrl ?? defaultImage}
            alt={record?.name ?? 'image'}
          />
        </ConfigProvider>
      )
    },
    {
      title: dictionary.az.name,
      dataIndex: 'name',
      key: 'name',
      render: record => renderEllipsisText(record)
    },
    {
      title: dictionary.az.description,
      dataIndex: 'description',
      key: 'description',
      width: '40%',
      render: record => renderEllipsisText(record)
    },
    {
      title: dictionary.az.createdDate,
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (date: string) => {
        const formattedDate = dayjs(date, 'DD/MM/YYYY').format('DD.MM.YYYY');
        return renderEllipsisText(formattedDate);
      }
    },
    {
      title: dictionary.az.status,
      dataIndex: 'isActive',
      key: 'isActive',
      render: (record: boolean, raw: IGalleryItem) => (
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
      render: (_, raw: IGalleryItem) => (
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

  // const onSubmit: SubmitHandler<IGalleryFilter> = async (
  //   data: IGalleryFilter
  // ) => {
  //   setCurrentPage(1);
  //   const queryParamsData: IHTTPSParams[] =
  //     convertFormDataToQueryParams<IGalleryFilter>(data);
  //   setQueryParams(queryParamsData);
  //   setRefreshComponent(!refreshComponent);
  // };

  useEffect(() => {
    fetchGalleryList();
  }, [page, refreshComponent]);

  return (
    <div className="galleryContainer">
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
                title: dictionary.az.gallery
              }
            ]}
          />
          <Tooltip placement="right" title={dictionary.az.addBtn}>
            <AppHandledButton
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              loading={loading}
              onClick={() => {
                setShowAddGalleryModal(true);
              }}
              icon={<AiOutlinePlus />}
            />
          </Tooltip>
        </Row>
      </Card>

      <Spin size="large" spinning={loading}>
        <AppHandledTable
          columns={columns}
          data={galleryData}
          currentPage={page}
          totalPage={totalPage}
          onChangePage={(e: number) => setCurrentPage(e)}
          key={forceUpdate.current}
          rowKey={'id'}
        />
      </Spin>

      {showAddGalleryModal && (
        <AddGalleryModal
          setShowAddGalleryModal={setShowAddGalleryModal}
          setRefreshComponent={setRefreshComponent}
          showAddGalleryModal={showAddGalleryModal}
        />
      )}
      {showUpdateGalleryModal && selectedItem && (
        <EditGalleryModal
          selectedItem={selectedItem}
          setShowUpdateGalleryModal={setShowUpdateGalleryModal}
          setRefreshComponent={setRefreshComponent}
          showUpdateGalleryModal={showUpdateGalleryModal}
        />
      )}
    </div>
  );
}

export default Gallery;
