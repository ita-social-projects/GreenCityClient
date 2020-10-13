import { InjectionToken } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

export const SIGN_UP_TOKEN: InjectionToken<ComponentType<any>> = new InjectionToken<ComponentType<any>>('SIGN_UP_TOKEN');
export const SIGN_IN_TOKEN: InjectionToken<ComponentType<any>> = new InjectionToken<ComponentType<any>>('SIGN_IN_TOKEN');
export const RESTORE_PASSWORD_TOKEN: InjectionToken<ComponentType<any>> = new InjectionToken<ComponentType<any>>('RESTORE_PASSWORD_TOKEN');
