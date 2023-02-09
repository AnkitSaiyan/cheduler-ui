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
}
