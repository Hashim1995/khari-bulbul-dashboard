/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */

// import { IGlobalResponse } from '@/models/common';

import { IGlobalResponse } from '@/models/common';
import { IAddBlogForm, IGetBlogsResponse } from '@/modules/blogs/models';
import {
  ErrorCallBack,
  HttpUtil,
  IHTTPSParams
  //   IHTTPSParams
} from '../adapter-config/config';

export class BlogsServices {
  // eslint-disable-next-line no-use-before-define
  private static instance: BlogsServices | null;

  private constructor() {}

  public static getInstance(): BlogsServices {
    if (!this.instance) {
      BlogsServices.instance = new BlogsServices();
    }
    return BlogsServices.instance!;
  }

  // public async updateAccountigCategory(
  //   body: IUpdateAccountCategoryPayload,
  //   onError?: ErrorCallBack
  // ): Promise<IGlobalResponse> {
  //   const res = await HttpUtil.put(`/Nomeclatura`, body, onError);
  //   return res;
  // }

  public async getAllBlogs(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetBlogsResponse> {
    const res = await HttpUtil.get('/Post/GetAllBlogs', params, false, onError);
    return res;
  }

  public async getAllPlanedBlogs(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetBlogsResponse> {
    const res = await HttpUtil.get('/Post/GetAllPlannedBlogs', params, false, onError);
    return res;
  }


  public async getExportToExcel(onError?: ErrorCallBack) {
    const res = await HttpUtil.get('/Post/export-excel', null, false, onError);
    return res;
  }

  public async changeStatus(
    id: number,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(`Post/ChangeIsActive/${id}`, null, onError);
    return res;
  }

  public async addBlog(
    body: IAddBlogForm,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.post('/Post', body, onError);
    return res;
  }

  public async updateBlog(
    body: IAddBlogForm,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(`/Post`, body, onError);
    return res;
  }

  public async deleteBlog(
    id: number,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.delete(`/Post/${id}`, onError);
    return res;
  }
}
