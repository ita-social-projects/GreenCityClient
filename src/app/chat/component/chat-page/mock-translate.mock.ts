import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ standalone: true, name: 'translate' })
export class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

export class MockTranslateService {
  get(key: any) {
    return of(key);
  }

  instant(key: any) {
    return key;
  }
}
