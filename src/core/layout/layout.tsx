import { Col, Dropdown, Layout, MenuProps, Row, Typography } from 'antd';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import { Outlet, useNavigate } from 'react-router-dom';

// import { noDataText } from '@/utils/constants/texts';
import { dictionary } from '@/utils/constants/dictionary';
// import NotificationsPopover from '@/modules/notifications/components/popover';
// import TokenizedImage from '@/components/display/image';
import TokenizedImage from '@/components/display/image';
import Sidebar from '../static-components/sidebar';
import Footer from '../static-components/footer';

const { Header, Content } = Layout;
const { Text } = Typography;
function LayoutPage() {
  // const user = useSelector((state: RootState) => state.user.user);

  // eslint-disable-next-line no-unused-vars
  const [userToken, setUserToken] = useLocalStorage<any>('userToken', null);
  const [isDarkTheme, setDarkTheme] = useLocalStorage('darkTheme', true);
  const [dropdownActive, setDropdownActive] = useState(false);
  const navigate = useNavigate();
  const darkMode = useReadLocalStorage('darkTheme');
  const toggleTheme = () => {
    setDarkTheme((prevValue: boolean) => !prevValue);
  };

  const handleMenuClick: MenuProps['onClick'] = e => {
    if (e.key === '0') {
      navigate('personal-cabinet');
    }
    if (e.key === '1') {
      navigate('legal-cabinet');
    }
    if (e.key === '2') {
      toggleTheme();
    }
    if (e.key === '3') {
      setUserToken(null);
      navigate('/login');
    }
  };

  const handleOpenChange = (flag: boolean) => {
    setDropdownActive(flag);
  };

  const items: MenuProps['items'] = [
    // {
    //   label: (
    //     <Row>
    //       <BiUser /> <Text>{dictionary.az.personalCabinet}</Text>
    //     </Row>
    //   ),
    //   key: '0'
    // },

    {
      label: (
        <Row>
          {isDarkTheme ? (
            <>
              <FaSun /> <Text>{dictionary.az.lightMode}</Text>
            </>
          ) : (
            <>
              <FaMoon /> <Text>{dictionary.az.nightMode}</Text>
            </>
          )}
        </Row>
      ),
      key: '2'
    },
    {
      label: (
        <Row>
          <BiLogOut /> <Text>{dictionary.az.logout}</Text>
        </Row>
      ),
      key: '3'
    }
  ];

  return (
    <Layout
      style={{ minHeight: '100vh', overflowY: 'auto' }}
      className={darkMode ? 'darkMode' : ''}
    >
      <Sidebar />
      <Layout
        style={{
          paddingRight: 40,
          paddingLeft: 40,
          paddingTop: 20,
          paddingBottom: 20
        }}
      >
        <Header
          className="box z-1001"
          style={{
            position: 'sticky',
            top: 10,
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
            lineHeight: 1,
            marginBottom: '15px',
            backgroundColor: darkMode ? '#141414' : ''
          }}
        >
          <div style={{ paddingRight: '10px' }}>
            <Row align={'middle'} gutter={16}>
              <Col>{/* <NotificationsPopover /> */}</Col>

              <Col>
                <Dropdown
                  overlayClassName="user-dropdown"
                  menu={{ items, onClick: handleMenuClick }}
                  onOpenChange={handleOpenChange}
                  trigger={['click']}
                  className="pointer"
                  open={dropdownActive}
                >
                  <TokenizedImage
                    useCach
                    tokenized
                    imgType="avatar"
                    circle
                    style={{ width: 40, height: 40, borderRadius: '50%' }}
                    src={'user?.getFile?.fileUrl' ?? null}
                  />
                </Dropdown>
              </Col>
            </Row>
          </div>
        </Header>

        <Content style={{ overflow: 'initial' }}>
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default LayoutPage;
