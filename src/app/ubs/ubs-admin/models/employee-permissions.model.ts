export const GROUPS = [
  { name: 'clients', permissions: ['SEE_CLIENTS_PAGE'] },
  {
    name: 'employees',
    permissions: ['SEE_EMPLOYEES_PAGE', 'REGISTER_A_NEW_EMPLOYEE', 'EDIT_EMPLOYEE', 'DEACTIVATE_EMPLOYEE', 'EDIT_EMPLOYEES_AUTHORITIES']
  },
  {
    name: 'certificates',
    permissions: ['SEE_CERTIFICATES', 'CREATE_NEW_CERTIFICATE', 'EDIT_CERTIFICATE']
  },
  {
    name: 'orders',
    permissions: ['SEE_BIG_ORDER_TABLE', 'EDIT_ORDER']
  },
  {
    name: 'messages',
    permissions: ['SEE_MESSAGES_PAGE', 'CREATE_NEW_MESSAGE', 'EDIT_MESSAGE', 'DELETE_MESSAGE']
  },
  {
    name: 'tariffs',
    permissions: [
      'SEE_TARIFFS',
      'CREATE_NEW_LOCATION',
      'CREATE_NEW_COURIER',
      'CREATE_NEW_STATION',
      'EDIT_LOCATION',
      'EDIT_COURIER',
      'EDIT_STATION',
      'CREATE_PRICING_CARD',
      'SEE_PRICING_CARD',
      'EDIT_DELETE_DEACTIVATE_PRICING_CARD',
      'CONTROL_SERVICE'
    ]
  }
];

export const LABELS = {
  SEE_CLIENTS_PAGE: 'see-main-page',
  SEE_EMPLOYEES_PAGE: 'see-main-page',
  REGISTER_A_NEW_EMPLOYEE: 'create-card',
  EDIT_EMPLOYEES_AUTHORITIES: 'edit-authority',
  EDIT_EMPLOYEE: 'edit-card',
  DEACTIVATE_EMPLOYEE: 'delete-card',
  SEE_CERTIFICATES: 'see-main-page',
  CREATE_NEW_CERTIFICATE: 'create-card',
  EDIT_CERTIFICATE: 'edit-card',
  SEE_BIG_ORDER_TABLE: 'see-main-page',
  EDIT_ORDER: 'edit-card',
  SEE_MESSAGES_PAGE: 'see-main-page',
  CREATE_NEW_MESSAGE: 'create-card',
  EDIT_MESSAGE: 'edit-card',
  DELETE_MESSAGE: 'delete-card',
  SEE_TARIFFS: 'see-main-page',
  CREATE_NEW_LOCATION: 'create-location',
  CREATE_NEW_COURIER: 'create-courier',
  CREATE_NEW_STATION: 'create-station',
  EDIT_LOCATION: 'edit-location-name',
  EDIT_COURIER: 'edit-courier-name',
  EDIT_STATION: 'edit-destination-name',
  CREATE_PRICING_CARD: 'create-price-card',
  SEE_PRICING_CARD: 'see-price-card',
  CONTROL_SERVICE: 'edit-service',
  EDIT_DELETE_DEACTIVATE_PRICING_CARD: 'edit-delete-price-card',
  DELETE_LOCATION: 'delete-location',
  DELETE_DEACTIVATE_COURIER: 'delete-courier',
  DELETE_DEACTIVATE_STATION: 'delete-station'
};
export const PERMISSIONRULES = {
  CREATE_PRICING_CARD: {
    check: ['SEE_PRICING_CARD', 'EDIT_DELETE_DEACTIVATE_PRICING_CARD', 'CONTROL_SERVICE']
  },
  SEE_PRICING_CARD: {
    uncheck: ['CREATE_PRICING_CARD', 'EDIT_DELETE_DEACTIVATE_PRICING_CARD', 'CONTROL_SERVICE']
  },
  EDIT_DELETE_DEACTIVATE_PRICING_CARD: {
    check: ['SEE_PRICING_CARD']
  },
  CONTROL_SERVICE: {
    check: ['SEE_PRICING_CARD']
  }
};
