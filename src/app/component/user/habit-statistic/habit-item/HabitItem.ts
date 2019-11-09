import {Photo} from '../../../../model/photo/photo';

export class HabitItem {
  numb: number;
  activeIcon: Photo;
  nonActiveIcon: Photo;
  currentIcon: Photo;
  isActive: boolean;

  constructor(numb: number, activeIcon: Photo, nonActiveIcon: Photo, currentIcon: Photo, isActive: boolean) {
    this.numb = numb;
    this.activeIcon = activeIcon;
    this.nonActiveIcon = nonActiveIcon;
    this.currentIcon = nonActiveIcon;
    this.isActive = isActive;
  }

  setActive() {
    this.currentIcon = this.activeIcon;
  }

  setNonActive() {
    this.currentIcon = this.nonActiveIcon;
  }
}
