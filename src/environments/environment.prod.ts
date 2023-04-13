export interface Environment {
  production: boolean;
  serverBaseUrl: string;
  authClientId: string;
  userManagementApiUrl: string;
  redirectUrl: string;
  schedulerApiAuthScope: string;
}

export const environment: Environment = {
  production: true,
  serverBaseUrl: 'https://diflexmo-scheduler-api-uat.azurewebsites.net/api',
  userManagementApiUrl: 'https://auth.diflexmo.be/usermanagement/api',
  authClientId: 'd526e147-4713-4a0a-bf56-d8f500fb9a62',
  redirectUrl: window.location.origin,
  schedulerApiAuthScope: 'https://diflexmoauth.onmicrosoft.com/usermanagement.api/usermanagement.api',
};
