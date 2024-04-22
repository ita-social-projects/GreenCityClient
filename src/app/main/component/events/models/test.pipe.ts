import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'test'
})
export class TestPipe implements PipeTransform {
  transform<T extends object>(value: string, obj: T): T[keyof T] {
    return obj[value as keyof T];
  }
}
