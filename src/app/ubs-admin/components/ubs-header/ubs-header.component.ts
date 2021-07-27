import { Component } from '@angular/core';
import { ubsHeaderIcons } from '../ubs-image-pathes/ubs-header-icons';

@Component({
  selector: 'app-ubs-header',
  templateUrl: './ubs-header.component.html',
  styleUrls: ['./ubs-header.component.scss']
})
export class UbsHeaderComponent {
  ubsHeaderIcons = ubsHeaderIcons;
}
