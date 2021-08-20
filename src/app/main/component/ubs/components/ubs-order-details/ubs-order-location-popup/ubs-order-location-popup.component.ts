import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Region {
  id: number;
  value: string;
}

@Component({
  selector: 'app-ubs-order-location-popup',
  templateUrl: './ubs-order-location-popup.component.html',
  styleUrls: ['./ubs-order-location-popup.component.scss']
})
export class UbsOrderLocationPopupComponent implements OnInit {
  closeButton = './assets/img/profile/icons/cancel.svg';
  regions: Region[] = [
    { id: 0, value: 'Kyiv' },
    { id: 1, value: 'Kyiv region' },
    { id: 2, value: 'Other' }
  ];
  selectedValue: string = this.regions[0].value;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  redirectToMain() {
    this.router.navigate(['ubs']);
  }

  saveLocation() {
    console.log(this.selectedValue);
  }
}
