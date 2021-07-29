import { Component } from '@angular/core';
import { ubsHeaderIcons } from '../ubs-image-pathes/ubs-header-icons';

@Component({
  selector: 'app-ubs-header',
  templateUrl: './ubs-header.component.html',
  styleUrls: ['./ubs-header.component.scss']
})
export class UbsHeaderComponent {
  ubsHeaderIcons = ubsHeaderIcons;
  navLinks = [
    { name: 'Про нас', route: '/' },
    { name: 'Правила сортування', route: '/' },
    { name: 'Еко-магазин', route: '/' },
    { name: 'Green City', route: '/' }
  ];
}
