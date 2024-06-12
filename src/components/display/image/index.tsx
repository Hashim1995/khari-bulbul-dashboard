import { CSSProperties, useEffect, useState } from 'react';
import { ConfigProvider, Image, Skeleton } from 'antd';
import { useReadLocalStorage } from 'usehooks-ts';
import defaultImage from '@/assets/images/default-image.png';
import defaultAvatar from '@/assets/images/default-avatar.svg';
import { localeValues } from '@/utils/constants/dictionary';

interface IProps {
  useCach?: boolean;
  tokenized?: boolean;
  circle?: boolean;
  src: string;
  id?: string;
  defaultSrc?: string;
  style?: CSSProperties;
  key?: string | number;
  className?: string;
  preview?: boolean;
  imgType?: 'common' | 'avatar';
  onClick?: () => void;
}

function TokenizedImage({
  useCach = false,
  tokenized = false,
  src,
  id,
  defaultSrc = defaultImage,
  style,
  preview = false,
  key,
  className,
  circle = false,
  imgType = 'common',
  onClick
}: IProps) {
  const userToken = useReadLocalStorage<any>('userToken');

  const [imageUrl, setImageUrl] = useState('');
  const [skeleton, setSkeleton] = useState(false);

  const fetchImageCacher = async () => {
    try {
      setSkeleton(true);
      if (useCach) {
        const cache = await caches.open('imageCache');
        const cachedResponse = await cache.match(src);
        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          const objectUrl = URL.createObjectURL(blob);
          setImageUrl(objectUrl);
        } else {
          const headers = new Headers();
          tokenized && headers.append('Authorization', userToken.token);
          const response = await fetch(src, {
            headers
          });
          if (response.ok) {
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            src && (await cache.put(src, new Response(blob)));

            setImageUrl(objectUrl);
          } else {
            console.error('error 1');
          }
        }
      } else if (tokenized) {
        const response = await fetch(src, {
          headers: {
            Authorization: userToken.token
          }
        });
        if (response.ok) {
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setImageUrl(objectUrl);
        } else {
          console.error('error 2');
        }
      } else {
        setImageUrl(src);
      }
    } catch (error) {
      console.error('error 3', error);
    } finally {
      setSkeleton(false);
    }
  };

  useEffect(() => {
    src && fetchImageCacher();
    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [src]);

  return (
    // eslint-disable-next-line no-nested-ternary
    !skeleton ? (
      // eslint-disable-next-line camelcase
      <ConfigProvider locale={localeValues}>
        <Image
          className={className}
          src={imageUrl}
          fallback={imgType === 'common' ? defaultSrc : defaultAvatar}
          key={key?.toString()}
          style={{ ...style, objectFit: 'contain' }}
          aria-hidden
          id={id}
          preview={preview}
          onClick={onClick}
          placeholder={
            circle ? (
              <Skeleton.Avatar style={style} active />
            ) : (
              <Skeleton style={style} active />
            )
          }
          alt=""
        />
      </ConfigProvider>
    ) : imgType === 'common' ? (
      <Skeleton.Image style={style} active />
    ) : (
      <Skeleton.Avatar active />
    )
  );
}

export default TokenizedImage;
