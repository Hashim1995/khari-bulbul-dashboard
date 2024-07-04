import { IGlobalResponse, selectOption } from '@/models/common';

export interface IAddProductModalOneForm {
  name: string;
  nomenclaturaType: number | null;
  category: number | null;
  mainGroup: number | null;
}

export interface IEventsItem {
  id: number;
  name: string;
  description: string;
  content: string;
  showOnFirstScreen: boolean;
  userId: string;
  isActive: boolean;
  coverPhoto: any;
  nowOrLater: 1 | 2;
  plannedDate?:any;
}

export interface IAddEventForm {
  id?: number;
  name: string;
  description: string;
  content: string;
  showOnFirstScreen: boolean | null;
  coverPhoto?: any;
  language?: string | number | selectOption;
  postType: number;
  nowOrLater: 1 | 2;
  plannedDate?:any;
}

export interface IEventsFilter {
  name?: string;
  description?: string;
  content?: string;
  isActive?: boolean | null;
}

export interface IEventStatus {
  isActive: boolean;
}

export interface IGetEventsResponse extends IGlobalResponse {
  data: {
    totalDataCount: number;
    data: IEventsItem[];
  };
}
