/* eslint-disable eqeqeq */
/* eslint-disable no-else-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-prototype-builtins */
import { Modal } from 'antd';
import { selectOption } from '@/models/common';
import { IHTTPSParams } from '@/services/adapter-config/config';
// import { noTxt, sureModalDescription, sureModalTitle, yesTxt } from '../constants/texts';
import { dictionary } from '../constants/dictionary';

const userToken: any = localStorage.getItem('userToken');

/* eslint-disable no-restricted-syntax */
function convertFormDataToQueryParams<T>(formData: T): IHTTPSParams[] {
  const z: IHTTPSParams[] = [];
  for (const key in formData) {
    if (formData?.hasOwnProperty(key)) {
      z.push({
        name: key,
        value: formData[key] as string | number | null | selectOption
      });
    }
  }
  return z;
}

interface IshowCloseConfirmationModal {
  onClose: () => void;
  titleText?: string;
  descriptionText?: string;
  closeText?: string;
  okText?: string;
  isDark?: boolean;
}

const showCloseConfirmationModal = ({
  onClose,
  titleText,
  descriptionText,
  closeText,
  isDark,
  okText
}: IshowCloseConfirmationModal) => {
  Modal.confirm({
    title: titleText ?? dictionary.az.confirmTitle,
    content: descriptionText ?? dictionary.az.confirmDelete,
    onOk: onClose,
    cancelText: closeText ?? dictionary.az.noTxt,
    okText: okText ?? dictionary.az.yesTxt,
    className: `confirmModal ${isDark ? 'confirmModalDark' : ''}`
    // okButtonProps: { style: { backgroundColor: '#0a4b79' } }
  });
};

function convertBytesToReadableSize(bytes: number): string {
  const suffixes: string[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  let i: number = 0;
  while (bytes >= 1024 && i < suffixes.length - 1) {
    bytes /= 1024;
    i++;
  }

  const sizeFormat: string = `${bytes?.toFixed(1)} ${suffixes[i]}`;
  return sizeFormat;
}

function formatDate(inputDateTime: string | Date): string {
  const date = new Date(inputDateTime);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Note: Months are zero-based
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

// function formatDateToWords(date: Date | string): string {
//   const now = new Date();
//   if (!(date instanceof Date)) {
//     date = new Date(date);
//   }
//   const diff = now.getTime() - date.getTime();

//   const minute = 60 * 1000;
//   const hour = 60 * minute;
//   const day = 24 * hour;
//   const week = 7 * day;
//   const month = 30 * day;
//   const year = 365 * day;

//   if (diff < minute) {
//     const seconds = Math.floor(diff / 1000);
//     return `${seconds}  ${dictionary.az.second} ${dictionary.az.ago}`;
//   } else if (diff < hour) {
//     const minutes = Math.floor(diff / minute);
//     return `${minutes}  ${dictionary.az.minute} ${dictionary.az.ago}`;
//   } else if (diff < day) {
//     const hours = Math.floor(diff / hour);
//     return `${hours}  ${dictionary.az.hour} ${dictionary.az.ago}`;
//   } else if (diff < week) {
//     const days = Math.floor(diff / day);
//     return `${days}  ${dictionary.az.day} ${dictionary.az.ago}`;
//   } else if (diff < month) {
//     const weeks = Math.floor(diff / week);
//     return `${weeks}  ${dictionary.az.week} ${dictionary.az.ago}`;
//   } else if (diff < year) {
//     const months = Math.floor(diff / month);
//     return `${months}  ${dictionary.az.month} ${dictionary.az.ago}`;
//   } else {
//     const years = Math.floor(diff / year);
//     return `${years}  ${dictionary.az.year} ${dictionary.az.ago}`;
//   }
// }

function generateOptionListPerNumber(num: number): selectOption[] {
  const data = [];
  for (let i = 1; i < num + 1; i++) {
    data.push({
      value: i,
      label: `${i}`
    });
  }
  return data;
}

const tokenizeImage = async (file: any): Promise<any> => {
  const newFile = {
    ...file,
    status: 'done'
  };

  const src = newFile.fileUrl;
  const cache = await caches.open('imageCache');
  const cachedResponse = await cache.match(src);
  if (cachedResponse) {
    const blob = await cachedResponse.blob();
    const objectUrl = URL.createObjectURL(blob);
    newFile.url = objectUrl;
  } else {
    const response = await fetch(src, {
      headers: {
        Authorization: userToken?.token?.replace(/['"]+/g, '')
      }
    });
    if (response.ok) {
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      src && (await cache.put(src, new Response(blob)));
      newFile.url = objectUrl;
    }
  }
  return newFile;
};

function toCapitalize(str: string): string {
  const words: string[] = str.split(' ');
  const capitalizedWords: string[] = words.map(
    (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  return capitalizedWords.join(' ');
}

function findEnumValue(object: Record<string, any>, targetValue: any) {
  const keys = Object.keys(object);

  const foundKey = keys?.find(key => object[key] == targetValue);

  return foundKey || null;
}

function getLanguageName(languageNumber: number): string {
  switch (languageNumber) {
    case 1:
      return 'Az';
    case 2:
      return 'Eng';
    case 3:
      return 'De';
    default:
      throw new Error('Invalid language number');
  }
}

export {
  convertFormDataToQueryParams,
  generateOptionListPerNumber,
  convertBytesToReadableSize,
  showCloseConfirmationModal,
  // formatDateToWords,
  tokenizeImage,
  formatDate,
  toCapitalize,
  findEnumValue,
  getLanguageName
};
