import { Layout, Menu, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';

import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
// import { TbTemplate } from 'react-icons/tb';
import { TiHomeOutline } from 'react-icons/ti';
// import { ReactComponent as LogoCollapsed } from '@/assets/images/logo-collapsed.svg';
import { dictionary } from '@/utils/constants/dictionary';
import AppHandledButton from '@/components/display/button/handle-button';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { MdOutlineArticle, MdOutlineUnsubscribe, MdEventNote } from 'react-icons/md';
import { FiSettings } from 'react-icons/fi';
// import { TfiGallery } from 'react-icons/tfi';
import { BiMessageSquareDetail } from 'react-icons/bi';

// import { ReactComponent as Logo } from '@/assets/images/brand-logo.svg';
import Logo from '../../assets/images/logo.png.png';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem;
}

function Sidebar() {
  const darkMode = useReadLocalStorage('darkTheme');

  const [collapsed, setCollapsed] = useLocalStorage('menuCollapse', false);
  const location = useLocation();
  // const [current, setCurrent] = useState(location.pathname);

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    setSelectedItem(location.pathname);
  }, [location, collapsed]);

  const items: MenuItem[] = [
    getItem(
      <Link to="/home"> {dictionary.az.home} </Link>,
      '/home',
      <TiHomeOutline size={18} />
    ),

    getItem(
      <Link to="/blogs"> {dictionary.az.blogs} </Link>,
      '/blogs',
      <MdOutlineArticle size={18} />
    ),
    getItem(
      <Link to="/events"> {dictionary.az.events} </Link>,
      '/events',
      <MdEventNote size={18} />
    ),
    // getItem(
    //   <Link to="/gallery"> {dictionary.az.gallery} </Link>,
    //   '/gallery',
    //   <TfiGallery size={18} />
    // ),
    getItem(
      <Link to="/received-emails"> {dictionary.az.receivedEmails} </Link>,
      '/received-emails',
      <BiMessageSquareDetail size={18} />
    ),
    getItem(
      <Link to="/news-subscribers"> {dictionary.az.NewsSubscribers} </Link>,
      '/news-subscribers',
      <MdOutlineUnsubscribe size={18} />
    ),
    getItem(
      <Link to="/settings"> {dictionary.az.settings} </Link>,
      '/settings',
      <FiSettings size={18} />
    )
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        backgroundColor: !darkMode ? '#fff' : '#141414'
      }}
    >
      <div className="flex flex-col justify-between h-full py-2">
        <div>
          <div
            style={{
              width: '100%',
              height: 70,
              padding: 15,
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '10px',
              backgroundColor: darkMode ? '#141414' : '#fff'
            }}
          >
            {collapsed ? (
              <Link to="/home">
                <Image src={Logo} alt="log0" height={'100%'} preview={false} />
                {/* <Logo height={'80%'} /> */}
              </Link>
            ) : (
              <Link to="/home">
                <Image src={Logo} alt="log0" height={'120%'} preview={false} />
                {/* <Logo height={'120%'} /> */}
              </Link>
            )}
            <AppHandledButton
              icon={
                collapsed ? (
                  <FaAngleRight size={20} />
                ) : (
                  <FaAngleLeft size={20} />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                border: 'none',
                position: 'absolute',
                top: 20,
                zIndex: 999,
                left: collapsed ? 60 : 180,
                fontSize: '16px',
                width: 40,
                height: 40,
                borderRadius: '50%',
                // color: '#0a4b79',
                boxShadow: 'rgba(0, 0, 0, 0.35) 0 5px 15px'
              }}
              className="center"
            />
          </div>

          <Menu
            defaultSelectedKeys={[location.pathname]}
            openKeys={openKeys}
            onOpenChange={keys => {
              setOpenKeys(keys);
            }}
            selectedKeys={[selectedItem]}
            onSelect={({ key }) => {
              setSelectedItem(key);
            }}
            mode="inline"
            items={items}
          />
        </div>
      </div>
    </Sider>
  );
}

export default Sidebar;
