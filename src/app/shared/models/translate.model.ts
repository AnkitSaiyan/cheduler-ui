import { DUTCH_BE, ENG_BE } from '../utils/const';

export const Translate = Object.freeze({
  Success: {
    RevokePermits: {
      [ENG_BE]: 'Revoke permits successfully',
      [DUTCH_BE]: 'Vergunningen succesvol intrekken',
    },
    AccountDeletedSuccessfully: {
      [ENG_BE]: 'Account deleted successfully',
      [DUTCH_BE]: 'Account succesvol verwijderd',
    },
    AppointmentAddedSuccessfully: {
      [ENG_BE]: 'Appointment added successfully',
      [DUTCH_BE]: 'Afspraak succesvol toegevoegd',
    },
    AppointmentUpdatedSuccessfully: {
      [ENG_BE]: 'Appointment updated successfully',
      [DUTCH_BE]: 'Afspraak succesvol bijgewerkt',
    },
    AppointmentCancelledSuccessfully: {
      [ENG_BE]: 'Appointment cancel successfully',
      [DUTCH_BE]: 'Afspraak succesvol geannuleerd',
    },
    DocumentUploadSuccess: {
      [ENG_BE]: 'Your document has been uploaded succesfully!',
      [DUTCH_BE]: 'Het document is succesvol opgeladen.',
    },
  },
  Error: {
    Forbidden: {
      [ENG_BE]: 'Forbidden! You are not permitted to perform this action',
      [DUTCH_BE]: 'Verboden! U mag deze actie niet uitvoeren',
    },
    Unauthorized: {
      [ENG_BE]: 'Unauthorized! You are not authorized',
      [DUTCH_BE]: 'Ongeoorloofd! Jij bent niet geautoriseerd',
    },
    SomethingWrong: {
      [ENG_BE]: 'Something Went Wrong',
      [DUTCH_BE]: 'Er is iets fout gegaan',
    },
    FailedToSave: {
      [ENG_BE]: 'Failed to save the appointment',
      [DUTCH_BE]: 'Afspraak werd niet weerhouden',
    },
    FailedToUpload: {
      [ENG_BE]: 'Failed to upload.',
      [DUTCH_BE]: 'Uploaden is mislukt',
    },
    BackendCodes: {
      [ENG_BE]: {
        MSG_400_QR_EXPIRED: 'Your QR code has expired.',
        MSG_400_QR_INVALID: 'QR is not valid.',
      },
      [DUTCH_BE]: {
        MSG_400_QR_EXPIRED: 'Uw QR-code is verlopen.',
        MSG_400_QR_INVALID: 'QR is niet geldig.',
      },
    },
  },
  FileFormatNotAllowed: {
    [ENG_BE]: 'File format not allowed',
    [DUTCH_BE]: 'Bestandsformaat niet toegestaan.',
  },
  FileNotGreaterThan: {
    [ENG_BE]: 'File size should not be greater than',
    [DUTCH_BE]: 'De bestandsgrootte mag niet groter zijn dan.',
  },
  UploadLimitExceeded: {
    [ENG_BE]: 'Your upload limit has exceeded',
    [DUTCH_BE]: 'Ihr Upload-Limit wurde überschritten',
  },
  AreYouWantToChangeGender: {
    [ENG_BE]: 'Are you sure you want to switch the gender? Warning: Switching will discard the previously added exams.',
    [DUTCH_BE]:
      'Weet je zeker dat je van geslacht wilt veranderen? Waarschuwing: als u overschakelt, worden de eerder toegevoegde onderzoeken verwijderd.',
  },
  // Toast Messages
  DownloadSuccess: (filetype) => ({
    [ENG_BE]: `${filetype} file downloaded successfully`,
    [DUTCH_BE]: `${filetype} bestand succesvol gedownload`,
  }),

  DeleteSuccess: (filetype) => ({
    [ENG_BE]: `${filetype} Deleted successfully`,
    [DUTCH_BE]: `${filetype} Succesvol Verwijderd`,
  }),

  AddedSuccess: (filetype) => ({
    [ENG_BE]: `${filetype} Added successfully`,
    [DUTCH_BE]: `${filetype} Succesvol toegevoegd`,
  }),

  EditSuccess: (filetype) => ({
    [ENG_BE]: `${filetype} Updated successfully`,
    [DUTCH_BE]: `${filetype}Succesvol geüpdated`,
  }),
});



