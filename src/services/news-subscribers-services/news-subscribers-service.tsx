/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */

// import { IGlobalResponse } from '@/models/common';

import { IGetNewsSubscribersResponse } from '@/modules/news-subscribers/models';
import {
  ErrorCallBack,
  HttpUtil,
  IHTTPSParams
  //   IHTTPSParams
} from '../adapter-config/config';

export class NewsSubscribersServices {
  // eslint-disable-next-line no-use-before-define
  private static instance: NewsSubscribersServices | null;

  private constructor() {}

  public static getInstance(): NewsSubscribersServices {
    if (!this.instance) {
      NewsSubscribersServices.instance = new NewsSubscribersServices();
    }
    return NewsSubscribersServices.instance!;
  }

  // public async updateAccountigCategory(
  //   body: IUpdateAccountCategoryPayload,
  //   onError?: ErrorCallBack
  // ): Promise<IGlobalResponse> {
  //   const res = await HttpUtil.put(`/Nomeclatura`, body, onError);
  //   return res;
  // }

  public async getAllNewsSubscribers(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetNewsSubscribersResponse> {
    const res = await HttpUtil.get('/NewsSubscriber', params, false, onError);
    return res;
  }
}
