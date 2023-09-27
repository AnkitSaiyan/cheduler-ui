import { BodyType } from '../utils/const';
import { BodyPart } from './body-part.model';
import { PracticeAvailability } from './practice.model';

export interface Exam {
  id: number;
  name: string;
  expensive: number;
  info: string;
  instructions: string;
  uncombinables: number[];
  bodyType: BodyType;
  bodyPart: BodyPart[];
}

export interface CreateExamRequestData {
  name: string;
  expensive: number;
  roomsForExam: {
    roomId: number;
    duration: number;
  }[];
  info?: string;
  uncombinables?: number[];
  assistantCount: number;
  radiologistCount: number;
  nursingCount: number;
  secretaryCount: number;
  usersList: number[];
  practiceAvailability: PracticeAvailability[];
  id?: number;
}
