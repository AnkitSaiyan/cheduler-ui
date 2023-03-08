export interface SiteSettings {
  address: string;
  cancelAppointmentTime: number;
  disableAppointment: boolean;
  disableWarningText: string;
  doctorReferringConsent: 0 | 1;
  email: string;
  file: File;
  introductoryText: string;
  isSlotsCombinable: boolean;
  logo: string;
  name: string;
  reminderTime: number;
  telephone: number;
}


export interface IntroductoryText {
  heading: string;
  subHeading: string;
  bodyText: string;
}


