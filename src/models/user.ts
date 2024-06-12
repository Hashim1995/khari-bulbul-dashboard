import { IGlobalResponse } from './common';

export interface ILegalEntityDto {
  Id: number;
  Name: string;
  PhoneNumber: string;
  Email: string;
  Voen: string;
  StatusId: number;
  ActivityField: string;
  Address: string;
}

export interface ILegalEntityPhoto {
  id: number;
  mimeType: string;
  uploadDate: string;
  size: number;
  name: string;
  fileUrl: string;
}

export interface IAuth {
  Id: number;
  Name: string;
  Surname: string;
  FathersName: string;
  FinCode: string;
  PhoneNumber: string;
  Email: string;
  Status: string;
  Profession: string;
  Permission: string;
  IsFounder: boolean;
  getLegalEntityDto: ILegalEntityDto;
  getFile: ILegalEntityPhoto;
}

export interface ILogin {
  email?: string;
  password?: string;
}

export interface IRegister {
  name: string;
  surname: string;
  username: string;
  fatherName: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  mobilePhone: string;
  cardNumber: string;
  pin: string;
  tableNumber: string;
  birthdate: string;
  dateOfEmployment: string;
  dateOfDismissal: string;
  isTransactionsCounterpartyCard: boolean;
  division: string;
  initialAdjustmentTM: string;
  respondent: string;
  note: string;
  gender: number;
  userType: number;
  createdDate: string;
  fileId: number;
}

export interface ILoginResponse extends IGlobalResponse {
  data: {
    token?: string;
    expiration?: string;
  };
}
