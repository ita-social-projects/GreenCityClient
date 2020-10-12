import { ActionInterface } from './action.interface';
import { InjectionToken } from '@angular/core';

export const ACTION_TOKEN = new InjectionToken<ActionInterface>('action.config');

export const ACTION_CONFIG: {[name: string]: ActionInterface} = {
    create: {
        title: 'Create news',
        btnCaption: 'Publish'
    },
    edit: {
        title: 'Edit news',
        btnCaption: 'Edit'
    }
};
