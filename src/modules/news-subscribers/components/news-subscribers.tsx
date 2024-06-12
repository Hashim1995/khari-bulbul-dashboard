import { dictionary } from '@/utils/constants/dictionary';
import { useState, useRef, useEffect } from 'react';
import { Breadcrumb, Card, Row, Spin, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import AppHandledTable from '@/components/display/table';
// import AddEmailModal from '../modals/add-email-modal';
// import EditEmailModal from '../modals/edit-email-modal';
import { NewsSubscribersServices } from '@/services/news-subscribers-services/news-subscribers-service';

import { INewsSubscribersItem, IGetNewsSubscribersResponse } from '../models';

function NewsSubscribers() {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [emailsData, setNewsSubscribersData] = useState<
    INewsSubscribersItem[] | null
  >(null);

  const forceUpdate = useRef<number>(0);

  const fetchNewsSubscribersList = async () => {
    try {
      setLoading(true);
      const res: IGetNewsSubscribersResponse =
        await NewsSubscribersServices.getInstance().getAllNewsSubscribers([
          { name: 'offset', value: page }
        ]);
      if (res?.isSuccess) {
        setNewsSubscribersData(res?.data?.data);
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

  const renderEllipsisText = (record: string) => (
    <Typography.Paragraph
      style={{ margin: 0 }}
      ellipsis={{ rows: 2, tooltip: record }}
    >
      {record}
    </Typography.Paragraph>
  );

  const columns: ColumnsType<INewsSubscribersItem> = [
    {
      title: dictionary.az.email,
      dataIndex: 'email',
      key: 'email',
      render: record => renderEllipsisText(record)
    }
  ];

  useEffect(() => {
    fetchNewsSubscribersList();
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
                title: dictionary.az.NewsSubscribers
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
    </div>
  );
}

export default NewsSubscribers;
