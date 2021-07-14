import { ActionInterface } from '../../models/action.interface';
import { InjectionToken } from '@angular/core';
import { TextAreasHeight } from '@eco-news-models/create-news-interface';

export const ACTION_TOKEN = new InjectionToken<ActionInterface>('action.config');

export const ACTION_CONFIG: { [name: string]: ActionInterface } = {
  create: {
    title: 'create-news.title',
    btnCaption: 'create-news.publish-button'
  },
  edit: {
    title: 'create-news.edit-title',
    btnCaption: 'create-news.edit-button'
  }
};

export const TEXT_AREAS_HEIGHT: TextAreasHeight = {
  minTextAreaScrollHeight: 50,
  maxTextAreaScrollHeight: 128,
  minTextAreaHeight: '48px',
  maxTextAreaHeight: '128px'
};
