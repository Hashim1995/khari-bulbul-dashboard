import { dictionary } from '@/utils/constants/dictionary';
import { Breadcrumb, Card, Row, Space } from 'antd';

import { HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ContactUs from './contact-us';
// import WebsiteTitles from './website-titles';

function Settings() {
  return (
    <div>
      <Card size="small" className="box box-margin-y">
        <Row justify="space-between">
          <Space>
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
                  title: dictionary.az.settings
                }
              ]}
            />
          </Space>
        </Row>
      </Card>
      <ContactUs />
      {/* <WebsiteTitles /> */}
    </div>
  );
}

export default Settings;
