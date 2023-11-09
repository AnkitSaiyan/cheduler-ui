// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export interface Environment {
  production: boolean;
  serverBaseUrl: string;
  authClientId: string;
  userManagementApiUrl: string;
  redirectUrl: string;
  schedulerApiAuthScope: string;
}

export const environment: Environment = {
  production: false,
  serverBaseUrl: 'https://diflexmo-scheduler-api-dev.azurewebsites.net/api',
  userManagementApiUrl: 'https://auth.diflexmo.be/usermanagement/api',
  authClientId: '13246052-2e33-4f05-acd4-810603f05d77',
  redirectUrl: window.location.origin,
  schedulerApiAuthScope: 'https://diflexmoauthdev.onmicrosoft.com/cheduler.api/cheduler.api',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
