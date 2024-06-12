/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */

// import { IGlobalResponse } from '@/models/common';

import { IGlobalResponse } from '@/models/common';
import { IAddBookForm, IGetBooksResponse } from '@/modules/books/models';
import {
  ErrorCallBack,
  HttpUtil,
  IHTTPSParams
  //   IHTTPSParams
} from '../adapter-config/config';

export class BooksServices {
  // eslint-disable-next-line no-use-before-define
  private static instance: BooksServices | null;

  private constructor() {}

  public static getInstance(): BooksServices {
    if (!this.instance) {
      BooksServices.instance = new BooksServices();
    }
    return BooksServices.instance!;
  }

  // public async updateAccountigCategory(
  //   body: IUpdateAccountCategoryPayload,
  //   onError?: ErrorCallBack
  // ): Promise<IGlobalResponse> {
  //   const res = await HttpUtil.put(`/Nomeclatura`, body, onError);
  //   return res;
  // }

  public async getAllBooks(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetBooksResponse> {
    const res = await HttpUtil.get('/Book', params, false, onError);
    return res;
  }

  public async getExportToExcel(onError?: ErrorCallBack) {
    const res = await HttpUtil.get('/Book/export-excel', null, false, onError);
    return res;
  }

  public async changeStatus(
    id: number,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(
      `/Book/change-isActive/${id}`,
      null,
      onError
    );
    return res;
  }

  public async addBook(
    body: IAddBookForm,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.post('/Book', body, onError);
    return res;
  }

  public async updateBook(
    body: IAddBookForm,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(`/Book`, body, onError);
    return res;
  }

  public async deleteBook(
    id: number,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.delete(`/Book/${id}`, onError);
    return res;
  }
}
