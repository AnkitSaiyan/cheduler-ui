export interface ExamDetails {
  physician: number;
  exams: number[];
  comments?: string;
}

export interface SlotDetails {
  selectedDate: Date | null;
  selectedSlots: {
    [key: number]: string
  };
}
