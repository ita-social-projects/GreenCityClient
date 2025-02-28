import { initialBigOrderTableState } from '../state/bigOrderTable.state';
import {
  ChangingOrderDataSuccess,
  ChangingOrderPaymentStatus,
  GetColumnsSuccess,
  GetTableSuccess,
  ReceivedFailure,
  LoadFiltersSuccessAction,
  AddFiltersAction,
  RemoveFilter,
  AddFilterMultiAction,
  ClearFilters,
  GetLocationsDetailsSuccess,
  UpdateOrderInfoSuccess,
  UpdateOrderAddress,
  UpdateOrderAddressFail,
  UpdateOrderAddressSuccess,
  GetTableColumnWidth,
  GetTableColumnWidthSuccess
} from '../actions/bigOrderTable.actions';
import { createReducer, on } from '@ngrx/store';
import { IFilters } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { transformAddress } from '../functions';

export const bigOrderTableReducer = createReducer(
  initialBigOrderTableState,
  on(GetColumnsSuccess, (state, action) => ({
    ...state,
    bigOrderTableParams: action.bigOrderTableParams
  })),

  on(GetTableSuccess, (state, action) => {
    const prevContent = action.reset ? [] : state.bigOrderTable?.content ?? [];
    return {
      ...state,
      isFiltersApplied: true,
      bigOrderTable: {
        ...action.bigOrderTable,
        content: [...prevContent, ...action.bigOrderTable.content]
      }
    };
  }),

  on(ChangingOrderDataSuccess, (state, action) => ({
    ...state,
    bigOrderTable: {
      ...state.bigOrderTable,
      content: state.bigOrderTable.content.map((orderData) => {
        if (action.orderId.includes(orderData.id)) {
          const newOrderData = { ...orderData };
          newOrderData[action.columnName] = action.newValue;
          return newOrderData;
        }
        return orderData;
      })
    }
  })),

  on(UpdateOrderInfoSuccess, (state, action) => {
    if (!state.bigOrderTable || !state.bigOrderTable.content) {
      return state;
    }
    return {
      ...state,
      bigOrderTable: {
        ...state.bigOrderTable,
        content: state.bigOrderTable.content.map((orderData) =>
          orderData.id === action.updatedOrder.id ? { ...action.updatedOrder } : orderData
        )
      }
    };
  }),

  on(ChangingOrderPaymentStatus, (state, action) => ({
    ...state,
    bigOrderTable: {
      ...state.bigOrderTable,
      content: state.bigOrderTable.content.map((orderData) => {
        if (orderData.id === action.orderId) {
          const newOrderData = { ...orderData };
          const columnName = 'orderPaymentStatus';
          newOrderData[columnName] = action.newValue;
          return newOrderData;
        }
        return orderData;
      })
    }
  })),

  on(ReceivedFailure, (state, action) => ({
    ...state,
    error: action.error
  })),

  on(AddFiltersAction, (state, action) => ({
    ...state,
    isFiltersApplied: false,
    filters: { ...state.filters, ...action.filters }
  })),

  on(AddFilterMultiAction, (state, action) => ({
    ...state,
    filters: {
      ...state.filters,
      [action.filter.column]: Array.isArray(state.filters?.[action.filter.column])
        ? [...(state.filters[action.filter.column] as string[]), action.filter.value]
        : [action.filter.value]
    } as IFilters
  })),

  on(RemoveFilter, (state, action) => ({
    ...state,
    filters: {
      ...state.filters,
      [action.filter.column]: Array.isArray(state.filters[action.filter.column])
        ? (state.filters[action.filter.column] as string[]).filter((value) => value !== action.filter.value)
        : null
    }
  })),

  on(ClearFilters, (state, action) => {
    if (!action.columnName) {
      return { ...state, filters: null };
    }

    const isDate = action?.columnName.toLowerCase().includes('date');
    return {
      ...state,
      filters: isDate
        ? { ...state.filters, [action.columnName + 'To']: null, [action.columnName + 'From']: null }
        : { ...state.filters, [action.columnName]: null }
    };
  }),

  on(LoadFiltersSuccessAction, (state, action) => ({
    ...state,
    filters: action.filters
  })),

  on(GetLocationsDetailsSuccess, (state, action) => ({
    ...state,
    locationsDetails: action.locationsDetails
  })),

  on(UpdateOrderAddress, (state) => {
    return {
      ...state,
      isOrderAddressLoading: true
    };
  }),
  on(UpdateOrderAddressSuccess, (state, action) => {
    const orderIndex = state.bigOrderTable.content.findIndex((order) => order.id === action.address.orderId);
    if (orderIndex === -1) {
      return state;
    }
    const transformedAddress = transformAddress(action.address.orderAddressExportDetails);
    const updatedAddress = {
      region: transformedAddress.region.ua,
      city: transformedAddress.city.ua,
      district: transformedAddress.district.ua,
      address: transformedAddress.address.ua,
      commentToAddressForClient: transformedAddress.commentToAddressForClient
    };
    return {
      ...state,
      bigOrderTable: {
        ...state.bigOrderTable,
        content: state.bigOrderTable.content.map((order, index) => (index === orderIndex ? { ...order, ...updatedAddress } : order))
      },
      isOrderAddressLoading: false
    };
  }),
  on(UpdateOrderAddressFail, (state) => {
    return {
      ...state,
      isOrderAddressLoading: false
    };
  }),
  on(GetTableColumnWidth, (state) => {
    return {
      ...state,
      isOrderAddressLoading: false
    };
  }),
  on(GetTableColumnWidthSuccess, (state, action) => {
    return {
      ...state,
      tableColumnWidth: action.columnsWidth
    };
  })
);
