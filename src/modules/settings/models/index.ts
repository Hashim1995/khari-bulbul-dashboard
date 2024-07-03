import { IGlobalResponse } from '@/models/common';

export interface IContactUs {
  website: string | null;
  email: string | null;
  facebook: string | null;
  instagram: string | null;
}

export interface IGetContactUsResponse extends IGlobalResponse {
  data: IContactUs;
}

export interface IWebsiteTitles {

  aboutUsContent: string | null;
  aboutUsHeader: string | null;
  eventsContent: string | null;
  eventsHeader: string | null;
  mainContent: string | null;
  mainHeader: string | null;
  newsContent: string | null;
  newsHeader: string | null;
}

export interface IGetWebsiteTitlesResponse extends IGlobalResponse {
  data: IWebsiteTitles;
}
