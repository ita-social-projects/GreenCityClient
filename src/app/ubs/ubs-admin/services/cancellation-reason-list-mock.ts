import { CancellationReason } from '../../ubs/order-status.enum';

export const CancellationReasonList: any[] = [
  {
    value: CancellationReason.DELIVERED_HIMSELF,
    translation: 'order-cancel.reason.delivered-himself'
  },
  {
    value: CancellationReason.MOVING_OUT,
    translation: 'order-cancel.reason.moving-out'
  },
  {
    value: CancellationReason.OUT_OF_CITY,
    translation: 'order-cancel.reason.out-of-city'
  },
  {
    value: CancellationReason.DISLIKED_SERVICE,
    translation: 'order-cancel.reason.disliked-service'
  },
  {
    value: CancellationReason.OTHER,
    translation: 'order-cancel.reason.other'
  }
];
