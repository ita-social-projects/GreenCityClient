import { FilterModel } from '@shared/components/tag-filter/tag-filter.model';

export const tagsListPlacesData: Array<FilterModel> = [
  {
    name: 'Shops',
    nameUa: 'Магазини',
    isActive: false
  },
  {
    name: 'Restaurants',
    nameUa: 'Ресторани',
    isActive: false
  },
  {
    name: 'Recycling points',
    nameUa: 'Пункти приймання',
    isActive: false
  },
  {
    name: 'Events',
    nameUa: 'Події',
    isActive: false
  },
  {
    name: 'Saved places',
    nameUa: 'Збереженні місця',
    isActive: false
  }
];

export const baseFiltersForPlaces: Array<FilterModel> = [
  {
    name: 'Open now',
    nameUa: 'Відкрито зараз',
    isActive: false
  },
  {
    name: 'Special offers',
    nameUa: 'Спеціальні пропозиції',
    isActive: false
  }
];

export const servicesFiltersForPlaces: Array<FilterModel> = [
  {
    name: 'Vegan products',
    nameUa: 'Веганські продукти',
    isActive: false
  },
  {
    name: 'Bike rentals',
    nameUa: 'Прокат велосипедів',
    isActive: false
  },
  {
    name: 'Bike parking',
    nameUa: 'Стоянка для велосипедів',
    isActive: false
  },
  {
    name: 'Hotels',
    nameUa: 'Готелі',
    isActive: false
  },
  {
    name: 'Charging station',
    nameUa: 'Зарядна станція',
    isActive: false
  },
  {
    name: 'Cycling routes',
    nameUa: 'Велосипедні маршрути',
    isActive: false
  }
];
