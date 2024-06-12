/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */

// import { IGlobalResponse } from '@/models/common';

import { IGlobalResponse } from '@/models/common';
import { IGetEmailsResponse } from '@/modules/emails/models';
import {
  ErrorCallBack,
  HttpUtil,
  IHTTPSParams
  //   IHTTPSParams
} from '../adapter-config/config';

export class EmailsServices {
  // eslint-disable-next-line no-use-before-define
  private static instance: EmailsServices | null;

  private constructor() {}

  public static getInstance(): EmailsServices {
    if (!this.instance) {
      EmailsServices.instance = new EmailsServices();
    }
    return EmailsServices.instance!;
  }

  // public async updateAccountigCategory(
  //   body: IUpdateAccountCategoryPayload,
  //   onError?: ErrorCallBack
  // ): Promise<IGlobalResponse> {
  //   const res = await HttpUtil.put(`/Nomeclatura`, body, onError);
  //   return res;
  // }

  public async getAllEmails(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetEmailsResponse> {
    const res = await HttpUtil.get('/Contact', params, false, onError);
    return res;
  }

  public async getExportToExcel(onError?: ErrorCallBack) {
    const res = await HttpUtil.get(
      '/Emails/export-excel',
      null,
      false,
      onError
    );
    return res;
  }

  public async changeStatus(
    id: number,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(
      `/Emails/change-isActive/${id}`,
      null,
      onError
    );
    return res;
  }
}
