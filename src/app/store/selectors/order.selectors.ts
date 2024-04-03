import { createSelector } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';

export const orderSelectors = (store: IAppState) => store.order;

export const orderDetailsSelector = createSelector(orderSelectors, (order) => order.orderDetails);

export const personalDataSelector = createSelector(orderSelectors, (order) => order.personalData);

export const UBSCourierIdSelector = createSelector(orderSelectors, (order) => order.UBSCourierId);

export const tariffIdIdSelector = createSelector(orderSelectors, (order) => order.courierLocations?.tariffInfoId);

export const locationIdSelector = createSelector(orderSelectors, (order) => order.locationId);

export const courierLocationsSelector = createSelector(orderSelectors, (order) => order.courierLocations);

export const addressesSelector = createSelector(orderSelectors, (order) => order.addresses);

export const addressIdSelector = createSelector(orderSelectors, (order) => order.addressId);

export const existingOrderInfoSelector = createSelector(orderSelectors, (order) => order.existingOrderInfo);

export const orderSumSelector = createSelector(orderSelectors, (order) => order.orderSum);

export const certificatesSelector = createSelector(orderSelectors, (order) => order.certificates);

export const certificateUsedSelector = createSelector(orderSelectors, (order) => order.certificateUsed);

export const pointsUsedSelector = createSelector(orderSelectors, (order) => order.pointsUsed);

export const pointsSelector = createSelector(orderSelectors, (order) => order.orderDetails?.points);

export const isFirstFormValidSelector = createSelector(orderSelectors, (order) => order.firstFormValid);

export const isAddressLoadingSelector = createSelector(orderSelectors, (order) => order.isAddressLoading);

export const isOrderDetailsLoadingSelector = createSelector(orderSelectors, (order) => order.isOrderDetailsLoading);
