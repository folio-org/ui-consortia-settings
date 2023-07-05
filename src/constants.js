import { stripes as stripesConfig } from '../package';

export const CONTENT_TYPE_HEADER = 'Content-Type';
export const OKAPI_TENANT_HEADER = 'X-Okapi-Tenant';
export const OKAPI_TOKEN_HEADER = 'X-Okapi-Token';

/* APIs */
export const CONFIGURATIONS_API = 'configurations';
export const CONFIGURATIONS_ENTRIES_API = `${CONFIGURATIONS_API}/entries`;
export const CONSORTIA_API = 'consortia';
export const CONSORTIA_TENANTS_API = 'tenants';
export const CONSORTIA_USER_TENANTS_API = 'user-tenants';
export const DATA_EXPORT_API = 'data-export';
export const METADATA_PROVIDER_API = 'metadata-provider';
export const PATRON_GROUPS_API = 'groups';
/*  */

export const MODULE_ROOT_ROUTE = stripesConfig.route;

export const PACKAGE_SCOPE_REGEX = /^@[a-z\d][\w-.]{0,214}\//;
export const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

export const FILE_STATUSES = {
  NEW: 'NEW',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  COMPLETED_WITH_ERRORS: 'COMPLETED_WITH_ERRORS',
  FAIL: 'FAIL',
  UPLOADING: 'UPLOADING',
  UPLOADED: 'UPLOADED',
  COMMITTED: 'COMMITTED',
  ERROR: 'ERROR',
  ERROR_DEFINITION: 'ERROR_DEFINITION',
  DELETING: 'DELETING',
  DISCARDED: 'DISCARDED',
  CANCELLED: 'CANCELLED',
};

export const PUBLISH_COORDINATOR_STATUSES = {
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR',
  IN_PROGRESS: 'IN_PROGRESS',
};

export const CONTROLLED_VOCAB_LIMIT = 2000;
