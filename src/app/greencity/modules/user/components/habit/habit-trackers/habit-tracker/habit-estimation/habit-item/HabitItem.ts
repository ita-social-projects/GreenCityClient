import { Photo } from 'src/app/shared/models/photo/photo';

export class HabitItem {
  numb: number;
  icon: Photo;
  isActive: boolean;

  constructor(numb: number, icon: Photo, isActive: boolean) {
    this.numb = numb;
    this.icon = icon;
    this.isActive = isActive;
  }

  setActive() {
    this.isActive = true;
  }

  setNonActive() {
    this.isActive = false;
  }
}
