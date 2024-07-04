import { IGlobalResponse, selectOption } from '@/models/common';

export interface IAddProductModalOneForm {
  name: string;
  nomenclaturaType: number | null;
  category: number | null;
  mainGroup: number | null;
}

export interface IBlogsItem {
  id: number;
  name: string;
  description: string;
  content: string;
  showOnFirstScreen: boolean;
  userId: string;
  isActive: boolean;
  coverPhoto: any;
  nowOrLater: 1 | 2;
  plannedDate?:any;
}

export interface IAddBlogForm {
  id?: number;
  name: string;
  description: string;
  content: string;
  showOnFirstScreen: boolean | null;
  coverPhoto?: any;
  language?: string | number | selectOption;
  postType: number;
  nowOrLater: 1 | 2;
  plannedDate?:any;
}

export interface IBlogsFilter {
  name?: string;
  description?: string;
  content?: string;
  isActive?: boolean | null;
}

export interface IBlogStatus {
  isActive: boolean;
}

export interface IGetBlogsResponse extends IGlobalResponse {
  data: {
    totalDataCount: number;
    data: IBlogsItem[];
  };
}
