import { IGlobalResponse } from '@/models/common';

export interface INewsSubscribersItem {
  id: number;
  email: string;
}

export interface IGetNewsSubscribersResponse extends IGlobalResponse {
  data: {
    totalDataCount: number;
    data: INewsSubscribersItem[];
  };
}
