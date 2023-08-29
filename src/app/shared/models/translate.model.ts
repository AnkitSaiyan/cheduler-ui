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
});
