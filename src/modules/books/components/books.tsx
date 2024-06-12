import { dictionary } from '@/utils/constants/dictionary';
import { useState, useRef, useEffect } from 'react';
import AppHandledButton from '@/components/display/button/handle-button';
import '../styles/books.scss';
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
import { BooksServices } from '@/services/books-services/books-service';
import {
  AiFillDelete,
  AiFillEdit,
  AiFillEye,
  AiOutlinePlus
} from 'react-icons/ai';
import {
  getLanguageName,
  showCloseConfirmationModal
} from '@/utils/functions/functions';
import { ColumnsType } from 'antd/es/table';
import { toast } from 'react-toastify';
import { IGlobalResponse } from '@/models/common';
import { useReadLocalStorage } from 'usehooks-ts';
import AppHandledTable from '@/components/display/table';
import { IGetBooksResponse, IBooksItem } from '../models';
import AddBookModal from '../modals/add-book-modal';
import EditBookModal from '../modals/edit-book-modal';
import ViewBook from '../modals/view-book-modal';

function Books() {
  // const {
  //   reset,
  //   control,
  //   handleSubmit,
  //   formState: { errors }
  // } = useForm<IBooksFilter>({
  //   mode: 'onChange',
  //   defaultValues: {
  //     name: '',
  //     author: '',
  //     price: null,
  //     isActive: null
  //   }
  // });

  const darkMode = useReadLocalStorage('darkTheme');
  const [selectedItem, setSelectedItem] = useState<IBooksItem>();
  const [showAddBookModal, setShowAddBookModal] = useState<boolean>(false);
  const [showUpdateBookModal, setShowUpdateBookModal] =
    useState<boolean>(false);
  const [showViewBookModal, setShowViewBookModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [booksData, setBooksData] = useState<IBooksItem[] | null>(null);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const forceUpdate = useRef<number>(0);

  const fetchBooksList = async () => {
    try {
      setLoading(true);
      const res: IGetBooksResponse =
        await BooksServices.getInstance().getAllBooks([
          { name: 'offset', value: page }
        ]);
      if (res?.isSuccess) {
        setBooksData(res?.data?.data);
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

  const handleEditClick = (raw: IBooksItem) => {
    setSelectedItem(raw);
    setShowUpdateBookModal(true);
  };

  const handleViewClick = (raw: IBooksItem) => {
    setSelectedItem(raw);
    setShowViewBookModal(true);
  };

  const deleteBook = async (id: number) => {
    try {
      setLoading(true);
      const res: IGlobalResponse = await BooksServices.getInstance().deleteBook(
        id
      );
      if (res?.isSuccess) {
        toast.success(dictionary.az.successTxt);
        fetchBooksList();
      }
    } catch (error) {
      toast.error(dictionary.az.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (raw: IBooksItem) => {
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      titleText: dictionary.az.confirmTitle,
      descriptionText: dictionary.az.deleteModal,
      okText: dictionary.az.yesTxt,
      onClose: () => {
        deleteBook(raw?.id);
      }
    });
  };

  const onChangeStatus = async (id: number) => {
    try {
      setLoading(true);

      const res: IGlobalResponse =
        await BooksServices.getInstance().changeStatus(id);

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

  const columns: ColumnsType<IBooksItem> = [
    {
      title: dictionary.az.name,
      dataIndex: 'name',
      key: 'name',
      render: record => renderEllipsisText(record)
    },
    {
      title: dictionary.az.author,
      dataIndex: 'author',
      key: 'author',
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
      title: dictionary.az.price,
      dataIndex: 'price',
      key: 'price',
      render: (record: string) => (
        <Typography.Paragraph
          style={{ margin: 0 }}
          ellipsis={{ rows: 1, tooltip: record }}
        >
          {`${record} AZN`}
        </Typography.Paragraph>
      )
    },
    {
      title: dictionary.az.language,
      dataIndex: 'language',
      key: 'language',
      render: record => renderEllipsisText(getLanguageName(record))
    },
    {
      title: dictionary.az.status,
      dataIndex: 'isActive',
      key: 'isActive',
      render: (record: boolean, raw: IBooksItem) => (
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
      render: (_, raw: IBooksItem) => (
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

  // const onSubmit: SubmitHandler<IBooksFilter> = async (data: IBooksFilter) => {
  //   setCurrentPage(1);
  //   const queryParamsData: IHTTPSParams[] =
  //     convertFormDataToQueryParams<IBooksFilter>(data);
  //   setQueryParams(queryParamsData);
  //   setRefreshComponent(!refreshComponent);
  // };

  useEffect(() => {
    fetchBooksList();
  }, [page, refreshComponent]);

  return (
    <div className="booksContainer">
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
                title: dictionary.az.books
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
                setShowAddBookModal(true);
              }}
              icon={<AiOutlinePlus />}
            />
          </Tooltip>
        </Row>
      </Card>

      <Spin size="large" spinning={loading}>
        <AppHandledTable
          columns={columns}
          data={booksData}
          currentPage={page}
          totalPage={totalPage}
          onChangePage={(e: number) => setCurrentPage(e)}
          key={forceUpdate.current}
          rowKey="id"
        />
      </Spin>

      {showAddBookModal && (
        <AddBookModal
          setShowAddBookModal={setShowAddBookModal}
          setRefreshComponent={setRefreshComponent}
          showAddBookModal={showAddBookModal}
        />
      )}
      {showUpdateBookModal && selectedItem && (
        <EditBookModal
          selectedItem={selectedItem}
          setShowUpdateBookModal={setShowUpdateBookModal}
          setRefreshComponent={setRefreshComponent}
          showUpdateBookModal={showUpdateBookModal}
        />
      )}
      {showViewBookModal && selectedItem && (
        <ViewBook
          setShowViewBookModal={setShowViewBookModal}
          showViewBookModal={showViewBookModal}
          selectedItem={selectedItem}
        />
      )}
    </div>
  );
}

export default Books;
