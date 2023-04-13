import { Environment } from './environment';

export const environment: Environment = {
  production: true,
  serverBaseUrl: 'https://diflexmo-scheduler-api-dev.azurewebsites.net/api',
  userManagementApiUrl: 'https://auth.diflexmo.be/usermanagement/api',
  authClientId: 'd526e147-4713-4a0a-bf56-d8f500fb9a62',
  redirectUrl: window.location.origin,
  schedulerApiAuthScope: 'https://diflexmoauth.onmicrosoft.com/usermanagement.api/usermanagement.api',
};
