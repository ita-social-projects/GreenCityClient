import { MoreOptionsFormValue } from '../../models/more-options-filter.model';

export const initialMoreOptionsFormValue: MoreOptionsFormValue = {
  baseFilters: {
    'Open now': false,
    'Saved places': false,
    'Special offers': false
  },
  distance: {
    isActive: false,
    value: 5
  },
  servicesFilters: {
    Shops: false,
    Restaurants: false,
    Events: false,
    'Recycling points': false,
    'Vegan products': false,
    'Bike rentals': false,
    'Bike parking': false,
    Hotels: false,
    'Charging station': false,
    'Cycling routes': false
  }
};
