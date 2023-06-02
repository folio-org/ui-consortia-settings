import { lazy } from 'react';

export const AVAILABLE_SETTINGS = [
  'circulation',
  'data-export',
  'data-import',
  'inventory',
  'users',
];

export const SETTINGS_ROUTES = AVAILABLE_SETTINGS.reduce((acc, curr) => {
  acc[curr] = lazy(async () => import(`./settings/${curr}`));

  return acc;
}, {});
