/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */

// import { IGlobalResponse } from '@/models/common';

import { IGlobalResponse } from '@/models/common';
import { IAddGalleryForm, IGetGalleryResponse } from '@/modules/gallery/models';
import {
  ErrorCallBack,
  HttpUtil,
  IHTTPSParams
  //   IHTTPSParams
} from '../adapter-config/config';

export class GalleryServices {
  // eslint-disable-next-line no-use-before-define
  private static instance: GalleryServices | null;

  private constructor() {}

  public static getInstance(): GalleryServices {
    if (!this.instance) {
      GalleryServices.instance = new GalleryServices();
    }
    return GalleryServices.instance!;
  }

  // public async updateAccountigCategory(
  //   body: IUpdateAccountCategoryPayload,
  //   onError?: ErrorCallBack
  // ): Promise<IGlobalResponse> {
  //   const res = await HttpUtil.put(`/Nomeclatura`, body, onError);
  //   return res;
  // }

  public async getAllGallery(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetGalleryResponse> {
    const res = await HttpUtil.get('/PhotoGallery', params, false, onError);
    return res;
  }

  public async getExportToExcel(onError?: ErrorCallBack) {
    const res = await HttpUtil.get(
      '/Gallery/export-excel',
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
      `/PhotoGallery/change-isActive/${id}`,
      null,
      onError
    );
    return res;
  }

  public async addGallery(
    body: IAddGalleryForm,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.post('/PhotoGallery', body, onError);
    return res;
  }

  public async updateGallery(
    body: IAddGalleryForm,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(`/PhotoGallery`, body, onError);
    return res;
  }

  public async deleteGallery(
    id: number,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.delete(`/PhotoGallery/${id}`, onError);
    return res;
  }
}
