import { stripes as stripesConfig } from '../package';

export const CONTENT_TYPE_HEADER = 'Content-Type';
export const OKAPI_TENANT_HEADER = 'X-Okapi-Tenant';
export const OKAPI_TOKEN_HEADER = 'X-Okapi-Token';

/* APIs */
export const ALTERNATIVE_TITLE_TYPES_API = 'alternative-title-types';
export const BL_USERS_API = 'bl-users';
export const CANCELLATION_REASONS_API = 'cancellation-reason-storage/cancellation-reasons';
export const CLASSIFICATION_TYPES_API = 'classification-types';
export const CONFIGURATIONS_API = 'configurations';
export const CONFIGURATIONS_ENTRIES_API = `${CONFIGURATIONS_API}/entries`;
export const CONSORTIA_API = 'consortia';
export const CONSORTIA_TENANTS_API = 'tenants';
export const CONSORTIA_USER_TENANTS_API = 'user-tenants';
export const CONTRIBUTOR_TYPES_API = 'contributor-types';
export const DATA_EXPORT_API = 'data-export';
export const DEPARTMENTS_API = 'departments';
export const ELECTRONIC_ACCESS_RELATIONSHIPS_API = 'electronic-access-relationships';
export const HOLDINGS_NOTE_TYPES_API = 'holdings-note-types';
export const HOLDINGS_TYPES_API = 'holdings-types';
export const IDENTIFIERS_TYPES_API = 'identifier-types';
export const INSTANCE_FORMATS_API = 'instance-formats';
export const INSTANCE_NOTE_TYPES_API = 'instance-note-types';
export const INSTANCE_STATUSES_API = 'instance-statuses';
export const INSTANCE_TYPES_API = 'instance-types';
export const ITEM_NOTE_TYPES_API = 'item-note-types';
export const LOAN_TYPES_API = 'loan-types';
export const MATERIAL_TYPES_API = 'material-types';
export const METADATA_PROVIDER_API = 'metadata-provider';
export const MODES_OF_ISSUANCE_API = 'modes-of-issuance';
export const NATURE_OF_CONTENT_TERMS_API = 'nature-of-content-terms';
export const PATRON_GROUPS_API = 'groups';
export const PERMISSION_USERS_API = 'perms/users';
export const PUBLICATIONS_API = 'publications';
export const SETTINGS_SHARING_API = 'sharing/settings';
export const STATISTICAL_CODE_TYPES_API = 'statistical-code-types';
export const STATISTICAL_CODES_API = 'statistical-codes';
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

export const RECORD_SOURCE = {
  CONSORTIUM: 'consortium',
  FOLIO: 'folio',
  INN_REACH: 'inn-reach',
  LOCAL: 'local',
  MARC_RELATOR: 'marcrelator',
  RDA_CARRIER: 'rdacarrier',
  RDA_CONTENT: 'rdacontent',
  RDA_MODE_ISSUE: 'rdamodeissue',
  UC: 'UC',
};

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const UNIQUE_FIELD_KEY = '__key__';
