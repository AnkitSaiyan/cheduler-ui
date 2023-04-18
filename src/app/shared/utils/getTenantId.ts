import { DEV_SUBDOMAIN, DEV_TENANT_ID, UAT_TENANT_ID } from './const';

export function getTenantID(): string {
  const subDomain = window.location.host.split('.')[0];
  const localhost = 'localhost';

  switch (subDomain) {
    case localhost:
    case DEV_SUBDOMAIN:
      return DEV_TENANT_ID;
    default:
      return UAT_TENANT_ID;
  }
}
