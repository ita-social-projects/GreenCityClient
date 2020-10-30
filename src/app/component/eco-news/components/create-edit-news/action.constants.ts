import { ActionInterface } from '../../models/action.interface';
import { InjectionToken } from '@angular/core';
import { FilterModel, TextAreasHeight } from '@eco-news-models/create-news-interface';

export const ACTION_TOKEN = new InjectionToken<ActionInterface>('action.config');

export const ACTION_CONFIG: { [name: string]: ActionInterface } = {
    create: {
        title: 'Create news',
        btnCaption: 'Publish'
    },
    edit: {
        title: 'Edit news',
        btnCaption: 'Edit'
    },
};

export const TEXT_AREAS_HEIGHT: TextAreasHeight = {
    minTextAreaScrollHeight: 50,
    maxTextAreaScrollHeight: 128,
    minTextAreaHeight: '48px',
    maxTextAreaHeight: '128px',
};

export const FILTERS: Array<FilterModel> = [
    { name: 'News', isActive: false },
    { name: 'Events', isActive: false },
    { name: 'Education', isActive: false },
    { name: 'Initiatives', isActive: false },
    { name: 'Ads', isActive: false }
];
