/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */

// import { IGlobalResponse } from '@/models/common';

import { IGlobalResponse } from '@/models/common';
import {
  IContactUs,
  IGetContactUsResponse,
  IGetWebsiteTitlesResponse,
  IWebsiteTitles
} from '@/modules/settings/models';
import {
  ErrorCallBack,
  HttpUtil,
  IHTTPSParams
} from '../adapter-config/config';

export class SettingssServices {
  // eslint-disable-next-line no-use-before-define
  private static instance: SettingssServices | null;

  private constructor() {}

  public static getInstance(): SettingssServices {
    if (!this.instance) {
      SettingssServices.instance = new SettingssServices();
    }
    return SettingssServices.instance!;
  }

  // public async updateAccountigCategory(
  //   body: IUpdateAccountCategoryPayload,
  //   onError?: ErrorCallBack
  // ): Promise<IGlobalResponse> {
  //   const res = await HttpUtil.put(`/Nomeclatura`, body, onError);
  //   return res;
  // }

  public async getContactUs(
    onError?: ErrorCallBack
  ): Promise<IGetContactUsResponse> {
    const res = await HttpUtil.get(`/Setting`, null, false, onError);
    return res;
  }

  public async updateContactUs(
    body: IContactUs,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(`/Setting`, body, onError);
    return res;
  }

  public async getWebsiteTitles(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetWebsiteTitlesResponse> {
    const res = await HttpUtil.get(`/WebsiteTitle`, params, false, onError);
    return res;
  }

  public async updateWebsiteTitles(
    body: IWebsiteTitles,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(`/WebsiteTitle`, body, onError);
    return res;
  }
}
