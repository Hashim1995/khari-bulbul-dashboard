import FallbackSpinner from '@/components/display/FallbackSpinner';
import { Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';

const LoginPage = React.lazy(() => import('@core/static-pages/login-page'));
const RegisterPage = React.lazy(
  () => import('@core/static-pages/register-page')
);
const HomePage = React.lazy(() => import('@/modules/home/pages/index'));
const LayoutPage = React.lazy(() => import('@core/layout/layout'));

const SettingsPage = React.lazy(() => import('@/modules/settings/pages'));

const BlogsPage = React.lazy(() => import('@/modules/blogs/pages'));
const EventsPage = React.lazy(() => import('@/modules/events/pages'));
// const GalleryPage = React.lazy(() => import('@/modules/gallery/pages'));
const EmailsPage = React.lazy(() => import('@/modules/emails/pages'));
const NewsSubscribersPage = React.lazy(
  () => import('@/modules/news-subscribers/pages')
);

const routes = [
  {
    path: '/',
    element: (
      <Suspense fallback={<FallbackSpinner />}>
        <LayoutPage />
      </Suspense>
    ),
    children: [
      { path: '', element: <Navigate to="/home" /> },
      {
        path: '/home',
        index: true,
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <HomePage />
          </Suspense>
        )
      },
      {
        path: '/document-circulaion',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <h1>Document circulation</h1>
          </Suspense>
        )
      },

      {
        path: '/blogs',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <BlogsPage />
          </Suspense>
        )
      },
      {
        path: '/events',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <EventsPage />
          </Suspense>
        )
      },
      {
        path: '/settings',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <SettingsPage />
          </Suspense>
        )
      },
      // {
      //   path: '/gallery',
      //   element: (
      //     <Suspense fallback={<FallbackSpinner />}>
      //       <GalleryPage />
      //     </Suspense>
      //   )
      // },
      {
        path: '/received-emails',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <EmailsPage />
          </Suspense>
        )
      },
      {
        path: '/news-subscribers',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <NewsSubscribersPage />
          </Suspense>
        )
      },
      {
        path: 'no-permission',
        element: <h1>no permission</h1>
      },
      {
        path: '404',
        element: <h1>404</h1>
      }
    ]
  },
  {
    path: 'login',
    element: <LoginPage />
  },
  {
    path: 'register',
    element: <RegisterPage />
  },
  {
    path: '*',
    element: <Navigate to="/404" />
  }
];

export default routes;
