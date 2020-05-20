import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eco-places',
  templateUrl: './eco-places.component.html',
  styleUrls: ['./eco-places.component.scss']
})
export class EcoPlacesComponent implements OnInit {
  ecoPlaces = ["Everyday Bakery Cafe", "Culturist", "3 бобра", "Everyday Bakery Cafe", "Culturist", "3 бобра", 
  "Everyday Bakery Cafe", "Culturist", "3 бобра", "Everyday Bakery Cafe"];

  showEcoPlaces = this.ecoPlaces.slice(0, 3);

  constructor() { 
  }
  ngOnInit() {
  }

}
