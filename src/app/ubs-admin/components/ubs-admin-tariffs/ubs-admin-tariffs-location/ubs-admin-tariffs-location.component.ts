import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ubs-admin-tariffs-location',
  templateUrl: './ubs-admin-tariffs-location.component.html',
  styleUrls: ['./ubs-admin-tariffs-location.component.scss']
})
export class UbsAdminTariffsLocationComponent implements OnInit {
  @Input() isCity: boolean;
  @Input() isLocation: boolean;
  constructor() {}

  ngOnInit(): void {}

  openCity() {
    this.isCity = true;
    this.isLocation = false;
  }
}
