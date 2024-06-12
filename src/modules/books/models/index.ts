import {
  IFileServerResponse,
  IGlobalResponse,
  selectOption
} from '@/models/common';

export interface IAddProductModalOneForm {
  name: string;
  nomenclaturaType: number | null;
  category: number | null;
  mainGroup: number | null;
}

export interface IBooksItem {
  id: number;
  name: string;
  author: string;
  description: string;
  price: number;
  coverPhoto: any;
  audioFile: any;
  pdfFile: any;
  showOnFirstScreen: boolean;
  rowNum: number;
  isActive: boolean;
  language: selectOption;
}

export interface IAddBookForm {
  id?: number;
  name: string;
  author: string;
  description: string;
  price: number | null;
  coverPhoto: string | null;
  audioFile: IFileServerResponse | number | null;
  pdfFile: IFileServerResponse | null | number;
  showOnFirstScreen: boolean | null;
  language?: string | number | selectOption;
}

export interface IBooksFilter {
  name?: string;
  author?: string;
  price?: number | null;
  isActive?: boolean | null;
}

export interface IBookStatus {
  isActive: boolean;
}

export interface IGetBooksResponse extends IGlobalResponse {
  data: {
    totalDataCount: number;
    data: IBooksItem[];
  };
}
