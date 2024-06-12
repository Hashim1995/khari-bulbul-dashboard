/* eslint-disable prefer-destructuring */
import { dictionary } from './dictionary';

export const inputPlaceholderText = (t?: string): string =>
  t ? `${t} xanasını daxil edin` : dictionary.az.enter;

export const selectPlaceholderText = (t?: string): string =>
  t ? `${t} xanasından seçim edin` : dictionary.az.select;

// export const yesTxt: string = dictionary.az.yesTxt;
// export const searchTxt: string = dictionary.az.searchTxt;
// export const resetTxt: string = dictionary.az.resetTxt;
// export const refreshTxt: string = dictionary.az.refreshTxt;
// export const noTxt: string = dictionary.az.noTxt;
// export const addBtn: string = dictionary.az.addBtn;
// export const editBtn: string = dictionary.az.editBtn;
// export const closeBtn: string = dictionary.az.closeBtn;
// export const viewImgModalHeader: string = dictionary.az.viewImgModalHeader;
// export const noDataText: string = dictionary.az.noDataText;
// export const sureModalTitle: string = dictionary.az.confirmTitle;
// export const sureModalDescription: string = dictionary.az.confirmDelete;

export const languagesOptions = [
  { label: 'Az', value: 1 },
  { label: 'Eng', value: 2 },
  { label: 'Ru', value: 3 }
];
