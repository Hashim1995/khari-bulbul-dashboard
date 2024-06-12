/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */

// import { IGlobalResponse } from '@/models/common';

import { IGlobalResponse } from '@/models/common';
import { IAddEventForm, IGetEventsResponse } from '@/modules/events/models';
import {
  ErrorCallBack,
  HttpUtil,
  IHTTPSParams
  //   IHTTPSParams
} from '../adapter-config/config';

export class EventsServices {
  // eslint-disable-next-line no-use-before-define
  private static instance: EventsServices | null;

  private constructor() {}

  public static getInstance(): EventsServices {
    if (!this.instance) {
      EventsServices.instance = new EventsServices();
    }
    return EventsServices.instance!;
  }

  // public async updateAccountigCategory(
  //   body: IUpdateAccountCategoryPayload,
  //   onError?: ErrorCallBack
  // ): Promise<IGlobalResponse> {
  //   const res = await HttpUtil.put(`/Nomeclatura`, body, onError);
  //   return res;
  // }

  public async getAllEvents(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetEventsResponse> {
    const res = await HttpUtil.get(
      '/Post/GetAllEvents',
      params,
      false,
      onError
    );
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

  public async addEvent(
    body: IAddEventForm,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.post('/Post', body, onError);
    return res;
  }

  public async updateEvent(
    body: IAddEventForm,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(`/Post`, body, onError);
    return res;
  }

  public async deleteEvent(
    id: number,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.delete(`/Post/${id}`, onError);
    return res;
  }
}
