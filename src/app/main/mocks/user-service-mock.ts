import { HabitItemsAmountStatisticDto } from '@global-models/goal/HabitItemsAmountStatisticDto';
import { UserPageableDtoModel } from '@global-models/user/user-pageable-dto.model';
import { UserRoleModel } from '@global-models/user/user-role.model';
import { UserStatusModel } from '@global-models/user/user-status.model';
import { UserUpdateModel } from '@global-models/user/user-update.model';

export const LISTOFUSERS: UserPageableDtoModel = {
  page: [
    {
      id: 1,
      firstName: 'petro',
      lastName: 'petrenko',
      email: 'petrenko@gmail.com',
      dateOfRegistration: new Date('2021-01-01'),
      userStatus: 'ACTIVE',
      role: 'USER'
    },
    {
      id: 2,
      firstName: 'ivan',
      lastName: 'ivanenko',
      email: 'ivanenko@gmail.com',
      dateOfRegistration: new Date('2021-02-02'),
      userStatus: 'ACTIVE',
      role: 'USER'
    },
    {
      id: 3,
      firstName: 'stepan',
      lastName: 'stepanenko',
      email: 'stepanenko@gmail.com',
      dateOfRegistration: new Date('2021-03-03'),
      userStatus: 'ACTIVE',
      role: 'USER'
    },
    {
      id: 4,
      firstName: 'yuriy',
      lastName: 'yurchenko',
      email: 'yurchenko@gmail.com',
      dateOfRegistration: new Date('2021-04-04'),
      userStatus: 'ACTIVE',
      role: 'USER'
    },
    {
      id: 5,
      firstName: 'taras',
      lastName: 'tarasenko',
      email: 'tarasenko@gmail.com',
      dateOfRegistration: new Date('2021-05-05'),
      userStatus: 'ACTIVE',
      role: 'USER'
    }
  ],
  totalElements: 5,
  currentPage: 1
};

export const USERCHANGESTATUS: UserStatusModel = {
  id: 1,
  userStatus: 'ACTIVE'
};

export const USERCHANGEROLE: UserRoleModel = {
  id: 1,
  role: 'ADMIN'
};

export const GETUSERPAGEBLE: UserPageableDtoModel = {
  page: [
    {
      id: 1,
      firstName: 'petro',
      lastName: 'petrenko',
      email: 'petrenko@gmail.com',
      dateOfRegistration: new Date('2021-01-01'),
      userStatus: 'ACTIVE',
      role: 'USER'
    },
    {
      id: 2,
      firstName: 'ivan',
      lastName: 'ivanenko',
      email: 'ivanenko@gmail.com',
      dateOfRegistration: new Date('2021-02-02'),
      userStatus: 'ACTIVE',
      role: 'USER'
    },
    {
      id: 3,
      firstName: 'stepan',
      lastName: 'stepanenko',
      email: 'stepanenko@gmail.com',
      dateOfRegistration: new Date('2021-03-03'),
      userStatus: 'ACTIVE',
      role: 'USER'
    },
    {
      id: 4,
      firstName: 'yuriy',
      lastName: 'yurchenko',
      email: 'yurchenko@gmail.com',
      dateOfRegistration: new Date('2021-04-04'),
      userStatus: 'ACTIVE',
      role: 'USER'
    },
    {
      id: 5,
      firstName: 'taras',
      lastName: 'tarasenko',
      email: 'tarasenko@gmail.com',
      dateOfRegistration: new Date('2021-05-05'),
      userStatus: 'ACTIVE',
      role: 'USER'
    }
  ],
  totalElements: 5,
  currentPage: 1
};

export const GETUPDATEUSER: UserUpdateModel = {
  firstName: 'petro',
  lastName: 'petrenko',
  emailNotification: 'petrenko@gmail.com'
};

export const HABITITEMS: HabitItemsAmountStatisticDto[] = [
  {
    habitItem: 'first',
    notTakenItems: 1
  },
  {
    habitItem: 'second',
    notTakenItems: 1
  }
];
