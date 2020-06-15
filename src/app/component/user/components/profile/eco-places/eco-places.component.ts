import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eco-places',
  templateUrl: './eco-places.component.html',
  styleUrls: ['./eco-places.component.scss']
})
export class EcoPlacesComponent implements OnInit {
  private ecoPlaces: Array<string> = [
    'Everyday Bakery Cafe', 'Culturist', '3 бобра',
    'Everyday Bakery Cafe', 'Culturist', '3 бобра',
    'Everyday Bakery Cafe', 'Culturist', '3 бобра',
    'Everyday Bakery Cafe'];

  constructor() {}

  ngOnInit() {}

  public getEcoPlaces(): Array<string> {
    return this.ecoPlaces.slice(0, 3);
  }
}
