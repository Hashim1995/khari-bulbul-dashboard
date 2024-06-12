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
  caruselGalleryHeader: string | null;
  caruselGalleryContent: string | null;
  aboutUsHeader: string | null;
  aboutUsContent: string | null;
  booksHeader: string | null;
  booksContent: string | null;
  founderHeader: string | null;
  founderContent: string | null;
  founderSpeciality: string | null;
  articleHeader: string | null;
  articleContent: string | null;
  photoGalleryHeader: string | null;
  photoGalleryContent: string | null;
  newsLetterHeader: string | null;
  newsLetterContent: string | null;
  bioContent: string | null;
}

export interface IGetWebsiteTitlesResponse extends IGlobalResponse {
  data: IWebsiteTitles;
}
