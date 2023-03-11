import { HabitAssignInterface, ResponseInterface } from '../interface/habit/habit-assign.interface';
import { HabitsForDateInterface } from '@global-user/components/profile/calendar/habit-popup-interface';
export const LISTOFHABITS: HabitAssignInterface[] = [
  {
    id: 1,
    status: 'SUSPENDED',
    createDateTime: new Date('2021-02-04'),
    habit: {
      defaultDuration: 12,
      amountAcquiredUsers: 1,
      habitTranslation: {
        description: 'habit, which will be useful for environment',
        habitItem: 'bags',
        languageCode: 'en',
        name: 'habit for buying eco bags'
      },
      id: 2,
      image: './assets/img/habit-circle-bg-shape.png',
      tags: ['bags', 'eco', 'green', 'natural'],
      isAssigned: true
    },
    enrolled: true,
    userId: 14,
    duration: 7,
    workingDays: 5,
    habitStreak: 2,
    lastEnrollmentDate: new Date('2021-04-07'),
    habitStatusCalendarDtoList: [
      { enrollDate: 'monday', id: 2 },
      { enrollDate: 'wednesday', id: 3 }
    ],
    shoppingListItems: [
      {
        id: 1,
        status: 'ACTIVE',
        text: 'TEST'
      }
    ]
  },
  {
    id: 2,
    status: 'INPROGRESS',
    createDateTime: new Date('2021-02-07'),
    habit: {
      defaultDuration: 16,
      amountAcquiredUsers: 2,
      habitTranslation: {
        description: 'habit, which will be useful for forest',
        habitItem: 'buying eco brush',
        languageCode: 'uk',
        name: 'habit for buying eco brush'
      },
      id: 3,
      image: './assets/img/habit-circle-bg-shape.png',
      tags: ['brush', 'eco', 'green', 'natural'],
      isAssigned: true
    },
    enrolled: true,
    userId: 17,
    duration: 8,
    workingDays: 6,
    habitStreak: 5,
    lastEnrollmentDate: new Date('2021-04-23'),
    habitStatusCalendarDtoList: [
      { enrollDate: 'monday', id: 2 },
      { enrollDate: 'wednesday', id: 3 }
    ],
    shoppingListItems: [
      {
        id: 2,
        status: 'ACTIVE',
        text: 'TEST'
      }
    ]
  },
  {
    id: 3,
    status: 'INPROGRESS',
    createDateTime: new Date('2021-02-07'),
    habit: {
      defaultDuration: 16,
      amountAcquiredUsers: 3,
      habitTranslation: {
        description: 'habit, which will be useful for forest',
        habitItem: 'buying eco brush',
        languageCode: 'uk',
        name: 'habit for buying eco brush'
      },
      id: 3,
      image: './assets/img/habit-circle-bg-shape.png',
      tags: ['brush', 'eco', 'green', 'natural'],
      isAssigned: true
    },
    enrolled: true,
    userId: 17,
    duration: 8,
    workingDays: 6,
    habitStreak: 5,
    lastEnrollmentDate: new Date('2021-04-23'),
    habitStatusCalendarDtoList: [
      { enrollDate: 'monday', id: 2 },
      { enrollDate: 'wednesday', id: 3 }
    ],
    shoppingListItems: [
      {
        id: 3,
        status: 'ACTIVE',
        text: 'TEST'
      }
    ]
  }
];
export const HABITSWITHTHESAMEHABITID: HabitAssignInterface[] = [
  {
    id: 1,
    status: 'SUSPENDED',
    createDateTime: new Date('2021-02-04'),
    habit: {
      defaultDuration: 12,
      amountAcquiredUsers: 1,
      habitTranslation: {
        description: 'habit, which will be useful for environment',
        habitItem: 'bags',
        languageCode: 'en',
        name: 'habit for buying eco bags'
      },
      id: 2,
      image: './assets/img/habit-circle-bg-shape.png',
      tags: ['bags', 'eco', 'green', 'natural'],
      isAssigned: true
    },
    enrolled: true,
    userId: 14,
    duration: 7,
    workingDays: 5,
    habitStreak: 2,
    lastEnrollmentDate: new Date('2021-04-07'),
    habitStatusCalendarDtoList: [
      { enrollDate: 'monday', id: 2 },
      { enrollDate: 'wednesday', id: 3 }
    ],
    shoppingListItems: [
      {
        id: 4,
        status: 'ACTIVE',
        text: 'TEST'
      }
    ]
  },
  {
    id: 3,
    status: 'INPROGRESS',
    createDateTime: new Date('2021-02-07'),
    habit: {
      defaultDuration: 16,
      amountAcquiredUsers: 1,
      habitTranslation: {
        description: 'habit, which will be useful for forest',
        habitItem: 'buying eco brush',
        languageCode: 'uk',
        name: 'habit for buying eco brush'
      },
      id: 3,
      image: './assets/img/habit-circle-bg-shape.png',
      tags: ['brush', 'eco', 'green', 'natural'],
      isAssigned: true
    },
    enrolled: true,
    userId: 17,
    duration: 8,
    workingDays: 6,
    habitStreak: 5,
    lastEnrollmentDate: new Date('2021-04-23'),
    habitStatusCalendarDtoList: [
      { enrollDate: 'monday', id: 2 },
      { enrollDate: 'wednesday', id: 3 }
    ],
    shoppingListItems: [
      {
        id: 5,
        status: 'ACTIVE',
        text: 'TEST'
      }
    ]
  }
];
export const NEWHABIT: HabitAssignInterface = {
  id: 2,
  status: 'SUSPENDED',
  createDateTime: new Date('2021-05-07'),
  habit: {
    defaultDuration: 12,
    amountAcquiredUsers: 1,
    habitTranslation: {
      description: 'habit, which will be useful for environment',
      habitItem: 'buying eco clothes',
      languageCode: 'uk',
      name: 'habit for buying eco clothes'
    },
    id: 3,
    image: './assets/img/habit-circle-bg-shape.png',
    tags: ['clothes', 'eco', 'green', 'natural'],
    isAssigned: true
  },
  enrolled: true,
  userId: 17,
  duration: 8,
  workingDays: 6,
  habitStreak: 5,
  lastEnrollmentDate: new Date(2021, 5, 23),
  habitStatusCalendarDtoList: [
    { enrollDate: 'monday', id: 2 },
    { enrollDate: 'wednesday', id: 3 }
  ],
  shoppingListItems: [
    {
      id: 6,
      status: 'ACTIVE',
      text: 'TEST'
    }
  ]
};
export const ASSIGNRESPONSE: ResponseInterface = {
  id: 1,
  status: 'SUSPENDED',
  createDateTime: new Date('2021-05-17'),
  habit: 2,
  userId: 13,
  duration: 7,
  workingDays: 5,
  habitStreak: 4,
  lastEnrollmentDate: new Date('2021-05-27')
};
export const MODIFIEDASSIGNRESPONCE: ResponseInterface = {
  id: 1,
  status: 'INPROGRESS',
  createDateTime: new Date('2021-05-17'),
  habit: 2,
  userId: 13,
  duration: 7,
  workingDays: 5,
  habitStreak: 4,
  lastEnrollmentDate: new Date('2021-05-27')
};

export const HABITSFORDATE: HabitsForDateInterface[] = [
  {
    enrollDate: '2021-05-20',
    habitAssigns: [
      {
        enrolled: false,
        habitDescription: 'buying eco bags, to reduce amount of pollution in environment',
        habitId: 2,
        habitName: 'buying eco bags'
      },
      {
        enrolled: true,
        habitDescription: 'buying eco brush, to reduce amount of pollution in environment',
        habitId: 3,
        habitName: 'buying eco brush'
      }
    ]
  },
  {
    enrollDate: '2021-05-30',
    habitAssigns: [
      {
        enrolled: false,
        habitDescription: 'buying eco clothes, to reduce amount of pollution in environment',
        habitId: 2,
        habitName: 'buying eco clothes'
      },
      {
        enrolled: true,
        habitDescription: 'buying healthy food, to reduce amount of pollution in environment',
        habitId: 3,
        habitName: 'buying healthy food'
      }
    ]
  }
];
