export interface ExamDetails {
  physician: number;
  exams: number[];
}

export interface SlotDetails {
  selectedDate: Date | null;
  selectedSlots: {
    [key: number]: string
  };
}
