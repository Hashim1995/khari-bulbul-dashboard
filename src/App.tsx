import { useNavigate, useRoutes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Suspense, useEffect } from 'react';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import routesList from '@core/routes/routes';
import SuspenseLoader from './core/static-components/suspense-loader';
import { getThemeConfig } from './configs/theme-config';

function App() {
  const router = useRoutes(routesList);

  const darkMode = useReadLocalStorage('darkTheme');
  // eslint-disable-next-line no-unused-vars
  const [isDarkTheme, setDarkTheme] = useLocalStorage('darkTheme', false);
  const userTokenData: any = useReadLocalStorage('userToken');

  const navigate = useNavigate();

  useEffect(() => {
    const hasToken = !!userTokenData?.token;

    if (!hasToken && window.location.pathname !== '/login') {
      navigate('/login');
    } else if (hasToken && window.location.pathname === '/') {
      navigate('/home');
    }
    if (darkMode === null) {
      setDarkTheme(false);
    }
  }, [userTokenData?.token, navigate]);

  return (
    <ConfigProvider theme={getThemeConfig(darkMode)}>
      <Suspense fallback={<SuspenseLoader />}>{router}</Suspense>
    </ConfigProvider>
  );
}

export default App;
