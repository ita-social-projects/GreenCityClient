import { EventResponse, EventResponseDto } from '../../../app/main/component/events/models/events.interface';
import { HttpParams } from '@angular/common/http';
import { HabitAssignInterface } from '@global-user/components/habit/models/interfaces/habit-assign.interface';
import { HabitStatus } from '@global-models/habit/HabitStatus.enum';
import { HabitInterface } from '@global-user/components/habit/models/interfaces/habit.interface';

export const testCases = [
  {
    title: 'Event1',
    selectedLocationFiltersList: ['Online', 'City1'],
    selectedEventTimeStatusFiltersList: ['2024-08-22'],
    selectedStatusFiltersList: ['active'],
    selectedTypeFiltersList: ['tag1'],
    expectedParams: new HttpParams()
      .append('page', '0')
      .append('size', '10')
      .append('title', 'EVENT1')
      .append('type', 'ONLINE')
      .append('cities', 'CITY1')
      .append('time', '2024-08-22')
      .append('statuses', 'ACTIVE')
      .append('tags', 'TAG1')
  },
  {
    title: 'Event2',
    selectedLocationFiltersList: ['City2'],
    selectedEventTimeStatusFiltersList: [],
    selectedStatusFiltersList: [],
    selectedTypeFiltersList: ['tag2', 'tag3'],
    expectedParams: new HttpParams()
      .append('page', '0')
      .append('size', '10')
      .append('title', 'EVENT2')
      .append('cities', 'CITY2')
      .append('tags', 'TAG2,TAG3')
  },
  {
    title: '',
    selectedLocationFiltersList: ['Online'],
    selectedEventTimeStatusFiltersList: [],
    selectedStatusFiltersList: ['inactive'],
    selectedTypeFiltersList: [],
    expectedParams: new HttpParams().append('page', '0').append('size', '10').append('type', 'ONLINE').append('statuses', 'INACTIVE')
  },
  {
    title: '',
    selectedLocationFiltersList: [],
    selectedEventTimeStatusFiltersList: ['2024-08-22'],
    selectedStatusFiltersList: [],
    selectedTypeFiltersList: [],
    expectedParams: new HttpParams().append('page', '0').append('size', '10').append('time', '2024-08-22')
  },
  {
    title: 'Event5',
    selectedLocationFiltersList: ['Online', 'City3'],
    selectedEventTimeStatusFiltersList: [],
    selectedStatusFiltersList: ['active'],
    selectedTypeFiltersList: [],
    expectedParams: new HttpParams()
      .append('page', '0')
      .append('size', '10')
      .append('title', 'EVENT5')
      .append('type', 'ONLINE')
      .append('cities', 'CITY3')
      .append('statuses', 'ACTIVE')
  },
  {
    title: '',
    selectedLocationFiltersList: [],
    selectedEventTimeStatusFiltersList: [],
    selectedStatusFiltersList: [],
    selectedTypeFiltersList: [],
    expectedParams: new HttpParams().append('page', '0').append('size', '10')
  }
];

export const mockParams = new HttpParams().append('page', '0').append('size', '1').append('type', 'ONLINE');

export const mockHttpParams = new HttpParams()
  .append('page', '0')
  .append('size', '10')
  .append('cities', 'City')
  .append('tags', 'Tag')
  .append('time', '2024-08-22')
  .append('statuses', 'CREATED')
  .append('userId', '1')
  .append('type', 'ONLINE');

export const mockHabitAssign: HabitAssignInterface[] = [
  {
    id: 1,
    status: 'CREATED' as HabitStatus,
    createDateTime: new Date('2023-03-20T04:00:00Z'),
    habit: { id: 2 } as HabitInterface,
    complexity: 1,
    enrolled: true,
    userId: 123,
    duration: 30,
    workingDays: 5,
    habitStreak: 10,
    lastEnrollmentDate: new Date(),
    habitStatusCalendarDtoList: [],
    shoppingListItems: []
  },
  {
    id: 2,
    status: 'CREATED' as HabitStatus,
    createDateTime: new Date('2023-03-22T04:00:00Z'),
    habit: { id: 4 } as HabitInterface,
    complexity: 1,
    enrolled: true,
    userId: 123,
    duration: 30,
    workingDays: 5,
    habitStreak: 10,
    lastEnrollmentDate: new Date(),
    habitStatusCalendarDtoList: [],
    shoppingListItems: []
  }
];

export const mockEvent: EventResponseDto = {
  currentPage: 0,
  first: true,
  hasNext: true,
  hasPrevious: false,
  last: false,
  number: 0,
  page: [
    {
      additionalImages: [],
      creationDate: '2022-05-31',
      dates: [
        {
          coordinates: {
            latitude: 1,
            longitude: 1,
            cityEn: 'Lviv',
            cityUa: 'Львів',
            countryEn: 'Ukraine',
            countryUa: 'Україна',
            houseNumber: '55',
            regionEn: 'Lvivska oblast',
            regionUa: 'Львівська область',
            streetEn: 'Svobody Ave',
            streetUa: 'Свободи',
            formattedAddressEn: 'Свободи, 55, Львів, Львівська область, Україна',
            formattedAddressUa: 'Svobody Ave, 55, Lviv, Lvivska oblast, Ukraine'
          },
          event: null,
          finishDate: '2022-06-29T04:00:00Z',
          id: null,
          onlineLink: 'http',
          startDate: '2022-06-29T04:00:00Z'
        }
      ],
      description: 'description',
      id: 95,
      open: true,
      organizer: {
        id: 12,
        name: 'username',
        organizerRating: 4
      },
      tags: [
        {
          id: 1,
          nameUa: 'Укр тег',
          nameEn: 'Eng Tag'
        }
      ],
      title: 'title',
      titleImage: 'image title',
      isSubscribed: true,
      isFavorite: false,
      likes: 8,
      countComments: 9,
      isRelevant: true,
      isOrganizedByFriend: false,
      eventRate: 0
    }
  ],
  totalElements: 12,
  totalPages: 1
};

export const mockFavouriteEvents: EventResponse[] = [
  {
    additionalImages: [],
    creationDate: '2022-05-31',
    dates: [
      {
        coordinates: {
          latitude: 1,
          longitude: 1,
          cityEn: 'Lviv',
          cityUa: 'Львів',
          countryEn: 'Ukraine',
          countryUa: 'Україна',
          houseNumber: '55',
          regionEn: 'Lvivska oblast',
          regionUa: 'Львівська область',
          streetEn: 'Svobody Ave',
          streetUa: 'Свободи',
          formattedAddressEn: 'Свободи, 55, Львів, Львівська область, Україна',
          formattedAddressUa: 'Svobody Ave, 55, Lviv, Lvivska oblast, Ukraine'
        },
        event: null,
        finishDate: '2022-06-29T04:00:00Z',
        id: null,
        onlineLink: 'http',
        startDate: '2022-06-29T04:00:00Z'
      }
    ],
    description: 'description',
    id: 96,
    open: true,
    organizer: {
      id: 12,
      name: 'username',
      organizerRating: 3
    },
    tags: [
      {
        id: 1,
        nameUa: 'Укр тег',
        nameEn: 'Eng Tag'
      }
    ],
    title: 'title',
    titleImage: 'image title',
    isSubscribed: true,
    isFavorite: true,
    likes: 8,
    countComments: 9,
    isRelevant: true,
    isOrganizedByFriend: false,
    eventRate: 0
  },
  {
    additionalImages: [],
    creationDate: '2022-05-31',
    dates: [
      {
        coordinates: {
          latitude: 1,
          longitude: 1,
          cityEn: 'Lviv',
          cityUa: 'Львів',
          countryEn: 'Ukraine',
          countryUa: 'Україна',
          houseNumber: '55',
          regionEn: 'Lvivska oblast',
          regionUa: 'Львівська область',
          streetEn: 'Svobody Ave',
          streetUa: 'Свободи',
          formattedAddressEn: 'Свободи, 55, Львів, Львівська область, Україна',
          formattedAddressUa: 'Svobody Ave, 55, Lviv, Lvivska oblast, Ukraine'
        },
        event: null,
        finishDate: '2022-06-29T04:00:00Z',
        id: null,
        onlineLink: 'http',
        startDate: '2022-06-29T04:00:00Z'
      }
    ],
    description: 'description',
    id: 14,
    open: true,
    organizer: {
      id: 12,
      name: 'username',
      organizerRating: 3
    },
    tags: [
      {
        id: 1,
        nameUa: 'Укр тег',
        nameEn: 'Eng Tag'
      }
    ],
    title: 'title',
    titleImage: 'image title',
    isSubscribed: true,
    isFavorite: true,
    likes: 8,
    countComments: 9,
    isRelevant: true,
    isOrganizedByFriend: false,
    eventRate: 0
  }
];

export const mockEventResponse: EventResponseDto = {
  currentPage: 0,
  first: true,
  hasNext: true,
  hasPrevious: false,
  last: false,
  number: 0,
  page: [
    {
      id: 1,
      title: 'Sample Event',
      organizer: {
        organizerRating: 4,
        id: 12,
        name: 'Event Organizer'
      },
      creationDate: '2024-08-22T00:00:00Z',
      description: 'A detailed description of the event.',
      dates: [
        {
          onlineLink: 'http://example.com',
          coordinates: {
            countryEn: 'CountryName',
            countryUa: 'НазваКраїни',
            latitude: 50.0,
            longitude: 10.0,
            regionEn: 'RegionName',
            regionUa: 'НазваРегіону',
            houseNumber: '123',
            streetEn: 'Street Name',
            streetUa: 'НазваВулиці',
            formattedAddressEn: 'Street Name, 123, CityName, RegionName, CountryName',
            formattedAddressUa: 'НазваВулиці, 123, Місто, НазваРегіону, НазваКраїни',
            cityEn: 'CityName',
            cityUa: 'Місто'
          },
          startDate: '2024-08-23T10:00:00Z',
          finishDate: '2024-08-23T18:00:00Z',
          id: null,
          event: null
        }
      ],
      tags: [
        {
          id: 1,
          nameUa: 'Тег',
          nameEn: 'Tag'
        }
      ],
      titleImage: 'http://example.com/image.jpg',
      additionalImages: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
      isRelevant: true,
      likes: 123,
      countComments: 45,
      eventRate: 4.5,
      open: true,
      isSubscribed: false,
      isFavorite: true,
      isOrganizedByFriend: false
    }
  ],
  totalElements: 1,
  totalPages: 1
};
