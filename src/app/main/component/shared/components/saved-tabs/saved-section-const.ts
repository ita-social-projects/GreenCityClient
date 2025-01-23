import { ActivatedRoute } from '@angular/router';

export function initializeSavedState(route: ActivatedRoute, callback: (isBookmark: boolean, section: string) => void): void {
  route.queryParams.subscribe((params) => {
    const isBookmark = params['isBookmark'] === 'true';
    const section = params['section'] || 'news';
    callback(isBookmark, section);
  });
}
