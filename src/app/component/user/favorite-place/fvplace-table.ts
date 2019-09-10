import {Component, OnInit, Inject} from '@angular/core';
import {FavoritePlace} from '../../../model/favorite-place/favorite-place';
import {FavoritePlaceService} from '../../../service/favorite-place/favorite-place.service';
import {ModalService} from '../_modal/modal.service';
import {PlaceService} from "../../../service/place/place.service";

export interface PeriodicElement {
  name: string;
  fpId: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-dialog-favorite-place',
  templateUrl: 'dialog-favorite-place.html',
})
export class FavoritePlaceModalComponent  {
  constructor(private modalService: ModalService) {}



  openModal(id: string) {
    this.modalService.open(id);
  }
}
/**
 * @title Basic use of `<table mat-table>`
 */

@Component({
  selector: 'app-fvplace-table',
  styleUrls: ['fvplace-table.css'],
  templateUrl: 'fvplace-table.html',
})
export class FvPlaceTableComponent  implements OnInit {
  displayedColumns: string[] = ['Id', 'Name', 'Actions'];
  //placeInfo : PlaceInfo;
  favoritePlaces: FavoritePlace[];

  constructor( private favoritePlaceService: FavoritePlaceService,private placeService: PlaceService, private modalService: ModalService
  ) {
  }
  ngOnInit() {
    console.log('favP ngOnInit');
    this.showAll();
  }
  // findOnMap(id: bigint){
  //   this.closeModal('fp-modal-1');
  //   this.placeInfo = this.placeService.getFavoritePlaceInfo(id);
  // }
  showAll() {
    console.log('fp show all');
    this.favoritePlaceService.findAllByUserEmail().subscribe((res) => this.favoritePlaces = res);
  }
  update(id: bigint, name: string) {// update in table
    console.log('fp update' + id);
    this.favoritePlaceService.updateFavoritePlace(new FavoritePlace(id, name + '1')).subscribe(() => this.showAll()); /// delete 1
  }
  delete(id: bigint) {// delete from table
    console.log('fp delete');
    this.favoritePlaceService.deleteFavoritePlace(id).subscribe(() => this.showAll());
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }

}

// //////////////////
// export class EditFavoriteNameComponent {
//   constructor(private name: String, modalService: ModalService) {
//
//   }
//
// }
//
//
//
//   openModal(id: string) {
//     this.modalService.open(id);
//   }
// }
