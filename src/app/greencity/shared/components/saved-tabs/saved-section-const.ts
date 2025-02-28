import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

export type SavedSection = 'news' | 'events' | 'places';

export function initializeSavedState(route: ActivatedRoute, callback: (isBookmark: boolean, section: SavedSection) => void): Subscription {
  return route.queryParams.subscribe((params) => {
    const isBookmark = params['isBookmark'] === 'true';
    const section = (params['section'] || 'news') as SavedSection;
    callback(isBookmark, section);
  });
}
