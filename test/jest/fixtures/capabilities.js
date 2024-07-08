export const capabilitiesSetsData = {
  'totalRecords': 3,
  'capabilitySets': [
    {
      id: 'data-capability-id',
      name: 'capability_roles.manage',
      description: 'Manage Roles',
      resource: 'Capability Roles',
      action: 'manage',
      applicationId: 'app-platform-minimal-0.0.4',
      permissions: [
        'ui-role-capabilities.manage',
        'role-capabilities.collection.post',
        'role-capabilities.collection.get',
      ],
      type: 'data',
      metadata: {
        createdDate: '2023-07-14T15:32:15.56000:00',
        modifiedDate: '2023-07-14T15:32:15.561+00:00',
      },
    },
    {
      id: 'settings-capability-id',
      name: 'capability_roles.manage',
      description: 'Manage Roles',
      resource: 'Capability Roles',
      action: 'manage',
      applicationId: 'app-platform-minimal-0.0.4',
      permissions: [
        'ui-role-capabilities.manage',
        'role-capabilities.collection.post',
        'role-capabilities.collection.get',
      ],
      type: 'settings',
      metadata: {
        createdDate: '2023-07-14T15:32:15.560+00:00',
        modifiedDate: '2023-07-14T15:32:15.561+00:00',
      },
    },
    {
      id: 'procedural-capability-id',
      name: 'capability_roles.manage',
      description: 'Manage Roles',
      resource: 'Capability Roles',
      action: 'manage',
      applicationId: 'app-platform-minimal-0.0.4',
      permissions: [
        'ui-role-capabilities.manage',
        'role-capabilities.collection.post',
        'role-capabilities.collection.get',
      ],
      type: 'procedural',
      metadata: {
        createdDate: '2023-07-14T15:32:15.560+00:00',
        modifiedDate: '2023-07-14T15:32:15.561+00:00',
      },
    },
  ],
};

export const capabilitiesData = {
  'totalRecords': 2,
  'capabilities': [
    {
      id: 'data-capability-id',
      name: 'capability_roles.manage',
      description: 'Manage Roles',
      resource: 'Capability Roles',
      action: 'manage',
      applicationId: 'app-platform-minimal-0.0.4',
      permissions: [
        'ui-role-capabilities.manage',
        'role-capabilities.collection.post',
        'role-capabilities.collection.get',
      ],
      type: 'data',
      metadata: {
        createdDate: '2023-07-14T15:32:15.56000:00',
        modifiedDate: '2023-07-14T15:32:15.561+00:00',
      },
    },
    {
      id: 'settings-capability-id',
      name: 'capability_roles.manage',
      description: 'Manage Roles',
      resource: 'Capability Roles',
      action: 'manage',
      applicationId: 'app-platform-minimal-0.0.4',
      permissions: [
        'ui-role-capabilities.manage',
        'role-capabilities.collection.post',
        'role-capabilities.collection.get',
      ],
      type: 'settings',
      metadata: {
        createdDate: '2023-07-14T15:32:15.560+00:00',
        modifiedDate: '2023-07-14T15:32:15.561+00:00',
      },
    },
    {
      id: 'procedural-capability-id',
      name: 'capability_roles.manage',
      description: 'Manage Roles',
      resource: 'Capability Roles',
      action: 'manage',
      applicationId: 'app-platform-minimal-0.0.4',
      permissions: [
        'ui-role-capabilities.manage',
        'role-capabilities.collection.post',
        'role-capabilities.collection.get',
      ],
      type: 'procedural',
      metadata: {
        createdDate: '2023-07-14T15:32:15.560+00:00',
        modifiedDate: '2023-07-14T15:32:15.561+00:00',
      },
    },
  ],
};

export const groupedRoleCapabilitySetsByType = {
  capabilitySetsTotalCount: 3,
  'data': [
    {
      'actions': {
        'manage': 'data-capability-id',
      },
      'applicationId': 'app-platform-minimal',
      'id': 'data-capability-id',
      'resource': 'Capability Roles',
    },
  ],
  'procedural': [
    {
      'actions': {
        'manage': 'procedural-capability-id',
      },
      'applicationId': 'app-platform-minimal',
      'id': 'procedural-capability-id',
      'resource': 'Capability Roles',
    },
  ],
  'settings': [
    {
      'actions': {
        'manage': 'settings-capability-id',
      },
      'applicationId': 'app-platform-minimal',
      'id': 'settings-capability-id',
      'resource': 'Capability Roles',
    },
  ],
}

export const groupedRoleCapabilitiesByType = {
  capabilitiesTotalCount: 3,
  'data': [
    {
      'actions': {
        'manage': 'data-capability-id',
      },
      'applicationId': 'app-platform-minimal',
      'id': 'data-capability-id',
      'resource': 'Capability Roles',
    },
  ],
  'procedural': [
    {
      'actions': {
        'manage': 'procedural-capability-id',
      },
      'applicationId': 'app-platform-minimal',
      'id': 'procedural-capability-id',
      'resource': 'Capability Roles',
    },
  ],
  'settings': [
    {
      'actions': {
        'manage': 'settings-capability-id',
      },
      'applicationId': 'app-platform-minimal',
      'id': 'settings-capability-id',
      'resource': 'Capability Roles',
    },
  ],
}
