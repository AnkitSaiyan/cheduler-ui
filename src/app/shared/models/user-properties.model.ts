export class UserProperties {
  id: string = '';
  displayName: string = '';
  givenName: string = '';
  surname: string = '';
  email: string = '';
  isExternal: boolean = false;
  properties: Record<string, string> = {};
}

export interface UserPropertiesRequestDate {
  givenName: string;
  surname: string;
  properties: {
    extension_PhoneNumber: string;
  };
}


