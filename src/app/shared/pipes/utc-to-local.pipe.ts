import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dfmUtcToLocal',
})
export class UtcToLocalPipe implements PipeTransform {
  public transform(utcDateTimeString: string | null | undefined, timeOnly = false): string {
    if (!utcDateTimeString) {
      return '';
    }

    if (timeOnly) {
      return this.utcTimeToLocalTimeString(utcDateTimeString);
    }

    return this.utcDateToLocalDate(new Date(utcDateTimeString)).toString();
  }

  private utcDateToLocalDate(utcDate: Date): Date {
    if (!utcDate) {
      return utcDate;
    }

    const newDate = new Date();
    newDate.setTime(utcDate.getTime() - utcDate.getTimezoneOffset() * 60 * 1000);

    return newDate;
  }

  private utcTimeToLocalTimeString(timeString: string): string {
    if (timeString.split(':').length < 2) {
      return timeString;
    }

    // generating utc date from time string
    const hour = +timeString.split(':')[0];
    const min = +timeString.split(':')[1];
    const utcDate = new Date();
    utcDate.setHours(hour);
    utcDate.setMinutes(min);

    // getting local date and time zone difference offset in minutes
    const localDate = new Date();
    const offsetMinutes = localDate.getTimezoneOffset();
    localDate.setTime(utcDate.getTime() - offsetMinutes * 60 * 1000);

    const localHour = `0${localDate.getHours()}`.slice(-2);

    const localMin = `0${localDate.getMinutes()}`.slice(-2);

    return `${localHour}:${localMin}`;
  }
}


