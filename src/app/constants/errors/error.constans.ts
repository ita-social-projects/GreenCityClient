import { InjectionToken } from '@angular/core';
import { ErrorMessageInterface } from '@global-models/errors/error-message.interface';

export const ACTION_TOKEN = new InjectionToken<ErrorMessageInterface>('errors.config');

export const ERRORS_MESSAGE_CONFIG: { [name: string]: ErrorMessageInterface } = {
  error: {
    message: 'Oops, something went wrong. Please reload page or try again later.',
  }
};
