import { environment } from 'src/environments/environment';
import { ProtectedApi } from './protected.config';

export class AuthConfig {
  static readonly protectedApis: ProtectedApi[] = [
    {
      url: environment.serverBaseUrl,
      scope: environment.schedulerApiAuthScope,
    },
    {
      url: environment.userManagementApiUrl,
      scope: 'https://diflexmoauth.onmicrosoft.com/usermanagement.api/usermanagement.api',
    },
  ];

  static readonly fullAuthority: string = 'https://diflexmoauth.b2clogin.com/diflexmoauth.onmicrosoft.com';

  static readonly authFlow: string = 'B2C_1_Cheduler_Patients_SignUp_SignIn';

  static readonly authority: string = 'diflexmoauth.b2clogin.com';

  static readonly authClientId: string = environment.authClientId;
}

