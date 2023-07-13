import { Status } from './status';
import { PracticeAvailability } from './practice.model';

export enum AvailabilityType {
  Unavailable,
  Available,
}

export enum UserType {
  Scheduler = 'scheduler',
  General = 'general',
  Radiologist = 'radiologist',
  Nursing = 'nursing',
  Assistant = 'assistant',
  Secretary = 'secretary',
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  telephone: string | number;
  address: string;
  availabilityType: AvailabilityType | null;
  gsm: string;
  status: Status;
  deletedBy: number | null;
  userType: UserType;
  examList: number[];
  practiceAvailability: PracticeAvailability[];
  info?: string;
  exams?: any[];
  rights?: any[];
  rizivNumber?: string;
  socialSecurityNumber?: string | number;

}

export class AuthUser {
  mail: string = '';

  givenName: string = '';

  surname: string = '';

  email: string = '';

  displayName: string = '';

  id: string = '';

  properties: Record<string, string> = {};

  socialSecurityNumber: string= '';

  constructor(
    mail: string,
    givenName: string,
    id: string,
    surname: string,
    displayName: string,
    email: string,
    properties: Record<string, string>,
    socialSecurityNumber: string,
  ) {
    this.mail = mail;
    this.givenName = givenName;
    this.id = id;
    this.properties = properties;
    this.surname = surname;
    this.displayName = displayName;
    this.email = email;
    this.socialSecurityNumber = socialSecurityNumber;
  }
}
