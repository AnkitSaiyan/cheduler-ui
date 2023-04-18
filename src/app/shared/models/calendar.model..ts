export enum Weekday {
  ALL,
  MON,
  TUE,
  WED,
  THU,
  FRI,
  SAT,
  SUN,
}

export interface TimeSlot {
  id?: number;
  dayStart: Date;
  dayEnd: Date;
}

export interface WeekWisePracticeAvailability {
  slotNo: number;
  monday: TimeSlot;
  tuesday: TimeSlot;
  wednesday: TimeSlot;
  thursday: TimeSlot;
  friday: TimeSlot;
  saturday: TimeSlot;
  sunday: TimeSlot;
}

export declare type TimeDurationType = 'Minutes' | 'Hours' | 'Days';

export enum Month {
  JAN = 1,
  FEB,
  MAR,
  APR,
  MAY,
  JUN,
  JUL,
  AUG,
  SEP,
  OCT,
  NOV,
  DEC,
}

export function getDaysOfMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getWeekdayOfDay(date: Date, day: number): number {
  const newDate = new Date(date);
  return new Date(newDate.getFullYear(), newDate.getMonth(), day).getDay();
}

export function getDateOfMonth(year: number, month: number, day = 0): number {
  return new Date(year, month, day).getDate();
}


export function getWeekdayWiseDays(date: Date, startFromSunday = false): number[][] {
  const year: number = date.getFullYear();
  const month: number = date.getMonth();
  const days: number = getDaysOfMonth(year, month);
  const currentWeekday: number = getWeekdayOfDay(date, 1);

  const daysMatrix: number[][] = [];

  let daysRow: number[] = [];

  for (let weekday = startFromSunday ? 0 : 1; weekday < currentWeekday; weekday++) {
    daysRow.push(getDateOfMonth(year, month, weekday - currentWeekday + 1) + 31);
  }

  if (currentWeekday === 0) {
    if (!startFromSunday) {
      // get previous month dates
      for (let weekday = 1; weekday < 7; weekday++) {
        daysRow.push(getDateOfMonth(year, month, weekday + 1 - 7) + 31);
      }
    }
  }

  for (let day = 1; day <= days; day++) {
    if (daysRow.length === 7) {
      daysMatrix.push(daysRow);
      daysRow = [];
    }

    daysRow.push(day);
  }

  // if days end before the last week then adding days of next month
  let day = 1 + 31;
  while (daysRow.length < 7) {
    daysRow.push(day++);
  }

  daysMatrix.push(daysRow);

  return daysMatrix;
}


export function getAllDaysOfWeek(selectedDate: Date): number[] {
  const weekday = new Date(selectedDate).getDay();
  const date = new Date(selectedDate).getDate();
  const year = new Date(selectedDate).getFullYear();
  const month = new Date(selectedDate).getMonth();

  const daysOfWeekArr: number[] = [];

  for (let day = weekday; day >= 0; day--) {
    daysOfWeekArr.push(getDateOfMonth(year, month, date - day));
  }

  for (let day = weekday + 1; day < 7; day++) {
    daysOfWeekArr.push(getDateOfMonth(year, month, date + (day - weekday)));
  }

  return daysOfWeekArr;
}

export function getDurationMinutes(start: Date, end: Date): number {
  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const startH = startDate.getHours();
    const endH = endDate.getHours();

    if (startH === endH) {
      return endDate.getMinutes() - startDate.getMinutes();
    }

    const hours = endH - (startH + 1);
    const minutes = 60 - startDate.getMinutes() + endDate.getMinutes();
    return Math.abs(hours * 60 + minutes);
  }

  return 0;
}


