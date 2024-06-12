import { IGlobalResponse } from '@/models/common';

export interface IAddProductModalOneForm {
  name: string;
  nomenclaturaType: number | null;
  category: number | null;
  mainGroup: number | null;
}

export interface IGalleryItem {
  id: number;
  name: string;
  createdDate: string | Date;
  description: string;
  coverPhoto: any;
}

export interface IAddGalleryForm {
  id?: number;
  name: string;
  description: string;
  coverPhoto: any;
}

export interface IGalleryFilter {
  name?: string;
  author?: string;
  price?: number | null;
  isActive?: boolean | null;
}

export interface IGalleryStatus {
  isActive: boolean;
}

export interface IGetGalleryResponse extends IGlobalResponse {
  data: {
    totalDataCount: number;
    data: IGalleryItem[];
  };
}
