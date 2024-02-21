export interface ExamDetails {
  physician: number | string;
  exams: number[];
  comments?: string;
  examsData?: any[];
}

export interface SlotDetails {
  selectedDate: Date | null;
  selectedSlots: {
    [key: number]: any;
  };
}

