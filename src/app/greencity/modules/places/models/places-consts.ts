import { FilterModel } from 'src/app/greencity/shared/components/tag-filter/tag-filter.model';

export const tagsListPlacesData: Array<FilterModel> = [
  {
    nameEn: 'Shops',
    nameUk: 'Магазини',
    isActive: false
  },
  {
    nameEn: 'Restaurants',
    nameUk: 'Ресторани',
    isActive: false
  },
  {
    nameEn: 'Recycling points',
    nameUk: 'Пункти приймання',
    isActive: false
  },
  {
    nameEn: 'Events',
    nameUk: 'Події',
    isActive: false
  },
  {
    nameEn: 'Saved places',
    nameUk: 'Збереженні місця',
    isActive: false
  }
];

export const baseFiltersForPlaces: Array<FilterModel> = [
  {
    nameEn: 'Open now',
    nameUk: 'Відкрито зараз',
    isActive: false
  },
  {
    nameEn: 'Special offers',
    nameUk: 'Спеціальні пропозиції',
    isActive: false
  }
];

export const servicesFiltersForPlaces: Array<FilterModel> = [
  {
    nameEn: 'Vegan products',
    nameUk: 'Веганські продукти',
    isActive: false
  },
  {
    nameEn: 'Bike rentals',
    nameUk: 'Прокат велосипедів',
    isActive: false
  },
  {
    nameEn: 'Bike parking',
    nameUk: 'Стоянка для велосипедів',
    isActive: false
  },
  {
    nameEn: 'Hotels',
    nameUk: 'Готелі',
    isActive: false
  },
  {
    nameEn: 'Charging station',
    nameUk: 'Зарядна станція',
    isActive: false
  },
  {
    nameEn: 'Cycling routes',
    nameUk: 'Велосипедні маршрути',
    isActive: false
  }
];
