# `temp` folder

This folder contains copied components from another module (`ui-users`) and is intended for temporary storage of duplicated code. Subsequently, it must be deleted after the required components have been moved to the shared source.

The folder stores the `<PermissionSetDetails>` and `<PermissionSetForm>` components and all their dependencies.

## Important changes

* We added `tenantId` for `PermissionSetForm` component in order to support fetching specific tenant permissions in switch tenant mode. The new `tenantId` prop needs to be added for `ui-users` module component in order to prevent interface divergences with the original component. Refs [#PR-50](https://github.com/folio-org/ui-consortia-settings/pull/50)
  