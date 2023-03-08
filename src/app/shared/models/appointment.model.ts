import { Physician } from './physician.model';
import { RoomType } from './rooms.model';
import { Exam } from './exam.model';
import { User } from './user.model';
import { AppointmentStatus, ReadStatus } from './status';

export interface Appointment {
  data: any;
  id: number;
  doctorId: number;
  doctor: Physician;
  patientFname: string;
  patientLname: string;
  patientEmail: string;
  patientTel: number;
  examName?: string;
  roomType: RoomType;
  comments: string;
  approval: AppointmentStatus;
  rejectReason: string;
  readStatus: ReadStatus;
  startedAt: Date;
  endedAt?: Date;
  createdBy?: number;
  updatedBy?: number;
  cancelTillTime?: string;
  user: User;
  userId: number;
  examList: number[];
  exams?: Exam[];
}

export interface AddAppointmentRequestData {
  doctorId: number;
  userId: number;
  patientFname: string;
  patientLname: string;
  patientEmail: string;
  patientTel: number;
  roomType: RoomType;
  comments: string;
  startedAt: Date;
  examList: number[];
  approval?: AppointmentStatus;
  createdBy?: number;
  updatedBy?: number;
  rejectReason?: string;
  readStatus?: number;
  endedAt?: Date | null;
  id?: number;
}

export interface Slot {
  start: string;
  end: string;
  examId: number;
  userList?: number[];
  roomList?: number[];
  exams: any[];
}

export interface ModifiedSlot {
  start: string;
  end: string;
  examId: number;
  userList?: number[];
  roomList?: number[];
  exams: any[];
}

export interface AppointmentSlot {
  title: string;
  start: string;
  end: string;
  workStatus: WorkStatusesEnum;
  workStatusText: WorkStatuses;
  isAvailable: boolean;
  slots: Slot[];
}

export type WorkStatuses = 'Working' | 'Holiday' | 'Off' | 'Past';

export enum WorkStatusesEnum {
  Working = 1,
  Holiday,
  Off,
  Past
}

export interface AppointmentSlotsRequestData {
  fromDate: string;
  toDate: string;
  exams: number[];
}
