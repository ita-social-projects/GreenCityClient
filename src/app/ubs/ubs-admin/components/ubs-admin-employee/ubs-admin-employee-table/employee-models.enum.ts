export enum selectOptions {
  all = 'all'
}

export enum filterOptions {
  city = 'city',
  courier = 'courier',
  position = 'position',
  region = 'region',
  contact = 'contact'
}

export enum filtersPlaceholderOptions {
  city = 'employees.city',
  courier = 'employees.courier',
  position = 'employees.position',
  region = 'employees.region',
  contact = 'employees.contact'
}

export enum authoritiesChangeEmployee {
  add = 'REGISTER_A_NEW_EMPLOYEE',
  edit = 'EDIT_EMPLOYEE',
  editauthorities = 'EDIT_EMPLOYEES_AUTHORITIES',
  deactivate = 'DEACTIVATE_EMPLOYEE'
}
