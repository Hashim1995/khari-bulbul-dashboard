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
  Typography
} from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { BlogsServices } from '@/services/blogs-services/blogs-service';
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
import { IGetBlogsResponse, IBlogsItem } from '../models';
import AddBlogModal from '../modals/add-blog-modal';
import EditBlogModal from '../modals/edit-blog-modal';

function BlogsPlaned() {
  // const {
  //   reset,
  //   control,
  //   handleSubmit,
  //   formState: { errors }
  // } = useForm<IBlogsFilter>({
  //   mode: 'onChange',
  //   defaultValues: {
  //     name: '',
  //     content: '',
  //     description: '',
  //     isActive: null
  //   }
  // });

  const darkMode = useReadLocalStorage('darkTheme');
  const [selectedItem, setSelectedItem] = useState<IBlogsItem>();
  const [showAddBlogModal, setShowAddBlogModal] = useState<boolean>(false);
  const [showUpdateBlogModal, setShowUpdateBlogModal] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [blogsData, setBlogsData] = useState<IBlogsItem[] | null>(null);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const forceUpdate = useRef<number>(0);

  const fetchBlogsList = async () => {
    try {
      setLoading(true);
      const res: IGetBlogsResponse =
        await BlogsServices.getInstance().getAllPlanedBlogs([    // getAllPlanedBlogs
          { name: 'offset', value: page }
        ]);
      if (res?.isSuccess) {
        setBlogsData(res?.data?.data);
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

  const handleEditClick = (raw: IBlogsItem) => {
    setSelectedItem(raw);
    setShowUpdateBlogModal(true);
  };

  const deleteBlog = async (id: number) => {
    try {
      setLoading(true);
      const res: IGlobalResponse = await BlogsServices.getInstance().deleteBlog(
        id
      );
      if (res?.isSuccess) {
        toast.success(dictionary.az.successTxt);
        fetchBlogsList();
      }
    } catch (error) {
      console.error('error', error);
      toast.error(dictionary.az.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (raw: IBlogsItem) => {
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      titleText: dictionary.az.confirmTitle,
      descriptionText: dictionary.az.deleteModal,
      okText: dictionary.az.yesTxt,
      onClose: () => {
        deleteBlog(raw?.id);
      }
    });
  };

  const onChangeStatus = async (id: number) => {
    try {
      setLoading(true);

      const res: IGlobalResponse =
        await BlogsServices.getInstance().changeStatus(id);

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

  const columns: ColumnsType<IBlogsItem> = [
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
      title: dictionary.az.createdDate,
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
      render: (record: boolean, raw: IBlogsItem) => (
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
      render: (_, raw: IBlogsItem) => (
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
    fetchBlogsList();
  }, [page, refreshComponent]);

  return (
    <div className="blogsContainer">
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
                title: dictionary.az.news
              },
              {
                title: dictionary.az.willBePublished
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
                setShowAddBlogModal(true);
              }}
              icon={<AiOutlinePlus />}
            />
          </Tooltip>
        </Row>
      </Card>

      <Spin size="large" spinning={loading}>
        <AppHandledTable
          columns={columns}
          data={blogsData}
          currentPage={page}
          totalPage={totalPage}
          onChangePage={(e: number) => setCurrentPage(e)}
          key={forceUpdate.current}
          rowKey="id"
        />
      </Spin>

      {showAddBlogModal && (
        <AddBlogModal
          setShowAddBlogModal={setShowAddBlogModal}
          setRefreshComponent={setRefreshComponent}
          showAddBlogModal={showAddBlogModal}
        />
      )}
      {showUpdateBlogModal && selectedItem && (
        <EditBlogModal
          selectedItem={selectedItem}
          setShowUpdateBlogModal={setShowUpdateBlogModal}
          setRefreshComponent={setRefreshComponent}
          showUpdateBlogModal={showUpdateBlogModal}
        />
      )}
    </div>
  );
}

export default BlogsPlaned; 
