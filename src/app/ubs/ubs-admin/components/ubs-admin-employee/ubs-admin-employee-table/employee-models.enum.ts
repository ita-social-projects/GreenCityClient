export enum selectOptions {
  all = 'all'
}

export enum filterOptions {
  city = 'city',
  courier = 'courier',
  position = 'position',
  region = 'region',
  contact = 'contact',
  state = 'state'
}

export enum filtersPlaceholderOptions {
  city = 'employees.city',
  courier = 'employees.courier',
  position = 'employees.position',
  region = 'employees.region',
  contact = 'employees.contact'
}

export const filtersStateEmployeeOptions = [
  { nameEn: 'All', nameUa: 'Всі' },
  { nameEn: 'Active', nameUa: 'Активний' },
  { nameEn: 'Inactive', nameUa: 'Деактивований' }
];

export const EmployeeStatus = {
  active: 'ACTIVE',
  inactive: 'INACTIVE',
  all: ''
};

export enum authoritiesChangeEmployee {
  add = 'REGISTER_A_NEW_EMPLOYEE',
  edit = 'EDIT_EMPLOYEE',
  editauthorities = 'EDIT_EMPLOYEES_AUTHORITIES',
  deactivate = 'DEACTIVATE_EMPLOYEE'
}

export enum PopUpsStyles {
  green = 'green',
  red = 'red',
  lightGreen = 'light green'
}

export enum ActionTypeForPermissions {
  apply = 'apply',
  cancel = 'cancel'
}
