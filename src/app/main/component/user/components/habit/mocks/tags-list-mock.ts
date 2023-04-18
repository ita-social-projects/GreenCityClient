import { TagInterface } from '@shared/components/tag-filter/tag-filter.model';

export const FIRSTTAGITEM: TagInterface = {
  id: 1,
  name: 'Reusable',
  nameUa: 'Багаторазове використання'
};

export const SECONDTAGITEM: TagInterface = {
  id: 2,
  name: 'Testing',
  nameUa: 'Тестінг'
};

export const TAGLIST: TagInterface[] = [FIRSTTAGITEM, SECONDTAGITEM];
