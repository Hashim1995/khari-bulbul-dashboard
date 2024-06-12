import { IGlobalResponse } from '@/models/common';

export interface IEmailsItem {
  id: number;
  fullname: string;
  email: string;
  message: string;
}

export interface IGetEmailsResponse extends IGlobalResponse {
  data: {
    totalDataCount: number;
    data: IEmailsItem[];
  };
}
