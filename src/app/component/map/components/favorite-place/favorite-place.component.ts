import { Component, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef, MatIconRegistry } from '@angular/material';
import { FavoritePlaceService } from '../../../../service/favorite-place/favorite-place.service';
import { PlaceService } from '../../../../service/place/place.service';
import { FavoritePlace } from '../../../../model/favorite-place/favorite-place';
import { frontMailLink } from '../../../../links';
import { DomSanitizer } from '@angular/platform-browser';
import { EditFavoriteNameComponent } from './edit-favorite-name/edit-favorite-name';
import { DeleteFavoriteComponent } from './delete-favorite-place/delete-favorite-place';

export interface DialogData {
  placeId: number;
  name: string;
  test: string;
}

@Component({
  selector: 'app-favorite-place',
  templateUrl: './favorite-place.component.html'
})
export class FavoritePlaceComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Actions'];
  favoritePlaces: FavoritePlace[];
  frontMailLink: string;
  color = 'star-yellow';

  constructor(iconRegistry: MatIconRegistry, public dialog: MatDialog, public dialogRef: MatDialogRef<FavoritePlaceComponent>,
              private favoritePlaceService: FavoritePlaceService, private placeService: PlaceService, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'star-yellow',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/favorite-place/star-yellow2.svg'));
  }

  ngOnInit() {
    this.showAll();
    this.frontMailLink = frontMailLink;
  }

  showAll() {
    this.favoritePlaceService.findAllByUserEmail().subscribe((res) => this.favoritePlaces = res);
  }

  delete(id: number) {
    this.favoritePlaceService.deleteFavoritePlace(id).subscribe(() => this.showAll());
  }

  openDialog(idElement: number, nameElement: string): void {
    const dialogRef = this.dialog.open(EditFavoriteNameComponent, {
      width: '550px',
      data: {placeId: idElement, name: nameElement}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.showAll();
      this.favoritePlaceService.getFavoritePlaces();
    });
  }

  openDialogDelete(idElement: number, nameElement: string): void {
    const dialogRef = this.dialog.open(DeleteFavoriteComponent, {
      data: {placeId: idElement, name: nameElement}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.showAll();
      this.favoritePlaceService.getFavoritePlaces();
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  sendIdToServiceAndClose(idElement: number) {
    this.favoritePlaceService.subject.next(idElement);
    this.dialog.closeAll();
  }
}

