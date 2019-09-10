import {Component, OnInit, Inject, Input, OnChanges} from '@angular/core';
import {FavoritePlace} from '../../../model/favorite-place/favorite-place';
import {FavoritePlaceService} from '../../../service/favorite-place/favorite-place.service';
import {ModalService} from '../_modal/modal.service';
import {PlaceService} from '../../../service/place/place.service';

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
  displayedColumns: string[] = [ 'Name', 'Actions'];
  // placeInfo : PlaceInfo;
  favoritePlaces: FavoritePlace[];
  id: number;
  name: string;

  constructor( private favoritePlaceService: FavoritePlaceService, private placeService: PlaceService, private modalService: ModalService
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

  delete(id: number) {// delete from table
    console.log('fp delete');
    this.favoritePlaceService.deleteFavoritePlace(id).subscribe(() => this.showAll());
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }
  openModal(id: string, idfp: number, name: string) {
    this.id = idfp;
    this.name = name;
    this.modalService.open(id);
  }

}
@Component({
  selector: 'app-fvplace-edit-name',
  templateUrl: 'edit-name.html',
})
export class FavoritePlaceEditModalComponent  {
  @Input() id: number;
  @Input() name: string;
  constructor(private favoritePlaceService: FavoritePlaceService, private modalService: ModalService) {
  }

  update() {// update in table
    console.log('fp update id=' + this.id + ' name=' + this.name);
    this.favoritePlaceService.updateFavoritePlace(new FavoritePlace(this.id, this.name)).subscribe(); /// delete 1
    this.closeModal('fp-modal-edit');
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }

}
