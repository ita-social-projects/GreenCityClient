import { initialOrderState } from '../state/order.state';
import {
  ClearPersonalData,
  ClearOrderDetails,
  SetBags,
  GetOrderDetailsSuccess,
  GetCourierLocationsSuccess,
  ChangeCourierLocationSuccess,
  GetUbsCourierIdSuccess,
  GetLocationIdSuccess,
  GetCourierLocations,
  SetOrderSum,
  AddCertificate,
  RemoveCertificate,
  SetPointsUsed,
  SetFirstFormStatus,
  GetAddressesSuccess,
  GetPersonalDataSuccess,
  SetPersonalData,
  SetCertificateUsed,
  SetAdditionalOrders,
  SetOrderComment,
  GetOrderDetails,
  UpdateAddressSuccess,
  GetExistingOrderDetailsSuccess,
  GetExistingOrderDetails,
  GetExistingOrderTariffSuccess,
  CreateAddressSuccess,
  DeleteAddressSuccess,
  GetExistingOrderInfoSuccess,
  ClearOrderData,
  SetCertificates,
  SetAddress,
  UpdateAddress,
  DeleteAddress,
  CreateAddress
} from '../actions/order.actions';
import { createReducer, on } from '@ngrx/store';

export const orderReducer = createReducer(
  initialOrderState,
  on(SetBags, (state, action) => {
    const newBagVal = state.orderDetails.bags.map((item) => ({
      ...item,
      quantity: item.id === action.bagId ? action.bagValue : item.quantity
    }));
    return {
      ...state,
      orderDetails: {
        ...state.orderDetails,
        bags: newBagVal
      }
    };
  }),
  on(ClearPersonalData, (state) => ({
    ...state,
    personalData: null
  })),
  on(ClearOrderDetails, (state) => ({
    ...state,
    orderDetails: null
  })),
  on(GetOrderDetails, (state) => ({
    ...state,
    isOrderDetailsLoading: true
  })),
  on(GetOrderDetailsSuccess, (state, action) => ({
    ...state,
    orderDetails: action.orderDetails,
    isOrderDetailsLoading: false
  })),
  on(GetExistingOrderDetails, (state) => ({
    ...state,
    isOrderDetailsLoading: true
  })),
  on(GetExistingOrderDetailsSuccess, (state, action) => ({
    ...state,
    orderDetails: action.orderDetails,
    isOrderDetailsLoading: false
  })),
  on(GetExistingOrderTariffSuccess, (state, action) => ({
    ...state,
    locationId: action.locations.locationsDtosList[0].locationId,
    courierLocations: action.locations
  })),
  on(GetExistingOrderInfoSuccess, (state, action) => ({
    ...state,
    existingOrderInfo: action.orderInfo
  })),
  on(GetCourierLocations, (state, action) => ({
    ...state,
    pendingLocationId: action.locationId
  })),
  on(GetCourierLocationsSuccess, (state, action) => ({
    ...state,
    locationId: state.pendingLocationId,
    courierLocations: action.locations
  })),
  on(GetAddressesSuccess, (state, action) => ({
    ...state,
    addressId: null,
    addresses: action.locations
  })),
  on(CreateAddress, (state, action) => ({
    ...state,
    isAddressLoading: true
  })),
  on(CreateAddressSuccess, (state, action) => ({
    ...state,
    addressId: null,
    addresses: action.addresses,
    isAddressLoading: false
  })),
  on(UpdateAddress, (state, action) => ({
    ...state,
    isAddressLoading: true
  })),
  on(UpdateAddressSuccess, (state, action) => ({
    ...state,
    addressId: null,
    addresses: action.addresses,
    isAddressLoading: false
  })),
  on(DeleteAddress, (state, action) => ({
    ...state,
    isAddressLoading: true
  })),
  on(DeleteAddressSuccess, (state, action) => ({
    ...state,
    addressId: null,
    addresses: action.addresses,
    isAddressLoading: false
  })),
  on(GetPersonalDataSuccess, (state, action) => ({
    ...state,
    personalData: action.personalData
  })),
  on(ChangeCourierLocationSuccess, (state, action) => ({
    ...state,
    courierLocations: action.locations
  })),
  on(GetUbsCourierIdSuccess, (state, action) => ({
    ...state,
    UBSCourierId: action.courierId,
    certificates: [],
    certificateUsed: 0,
    pointsUsed: 0
  })),
  on(GetLocationIdSuccess, (state, action) => ({
    ...state,
    locationId: action.locationId
  })),
  on(SetOrderSum, (state, action) => ({
    ...state,
    orderSum: action.orderSum
  })),
  on(SetPointsUsed, (state, action) => ({
    ...state,
    pointsUsed: action.pointsUsed
  })),
  on(SetCertificateUsed, (state, action) => ({
    ...state,
    certificateUsed: action.certificateUsed
  })),
  on(SetCertificates, (state, action) => ({
    ...state,
    orderDetails: { ...state.orderDetails, certificates: action.certificates }
  })),
  on(SetFirstFormStatus, (state, action) => ({
    ...state,
    firstFormValid: action.isValid
  })),
  on(SetPersonalData, (state, action) => ({
    ...state,
    personalData: action.personalData
  })),
  on(SetAdditionalOrders, (state, action) => ({
    ...state,
    orderDetails: { ...state.orderDetails, additionalOrders: action.orders }
  })),
  on(SetOrderComment, (state, action) => ({
    ...state,
    orderDetails: { ...state.orderDetails, orderComment: action.comment }
  })),
  on(SetAddress, (state, action) => ({
    ...state,
    addressId: action.address?.id ?? null,
    personalData: {
      ...state.personalData,
      city: action.address?.city ?? '',
      cityEn: action.address?.cityEn ?? '',
      district: action.address?.district ?? '',
      districtEn: action.address?.districtEn ?? '',
      street: action.address?.street ?? '',
      streetEn: action.address?.streetEn ?? '',
      region: action.address?.region ?? '',
      regionEn: action.address?.regionEn ?? '',
      houseCorpus: action.address?.houseCorpus ?? '',
      houseNumber: action.address?.houseNumber ?? '',
      entranceNumber: action.address?.entranceNumber ?? null,
      longitude: action.address?.coordinates.longitude ?? null,
      latitude: action.address?.coordinates.latitude ?? null
    }
  })),
  on(AddCertificate, (state, action) => ({
    ...state,
    certificates: [...state.certificates, action.certificate]
  })),
  on(RemoveCertificate, (state, action) => ({
    ...state,
    certificates: state.certificates.filter((cert) => cert.code !== action.code)
  })),
  on(ClearOrderData, () => initialOrderState)
);
