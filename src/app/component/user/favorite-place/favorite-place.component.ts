import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatIconRegistry} from '@angular/material';
import {FavoritePlaceService} from '../../../service/favorite-place/favorite-place.service';
import {PlaceService} from '../../../service/place/place.service';
import {FavoritePlace} from '../../../model/favorite-place/favorite-place';
import {frontMailLink} from '../../../links';
import {DomSanitizer} from '@angular/platform-browser';

export interface DialogData {
  placeId: number;
  name: string;
  test: string;
}

@Component({
  selector: 'app-favorite-place',
  templateUrl: './favorite-place.component.html',
  styleUrls: ['./favorite-place.component.css']
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

@Component({
  selector: 'app-edit-name',
  templateUrl: 'edit-name.html'
})
export class EditFavoriteNameComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private favoritePlaceService: FavoritePlaceService) {
  }

  update(name: string) {
    this.favoritePlaceService.updateFavoritePlace(new FavoritePlace(this.data.placeId, name)).subscribe();
  }

  clickSubmit() {
    document.getElementById('closeButton').click();
  }
}

@Component({
  selector: 'app-delete-favorite-place',
  templateUrl: 'delete-favorite-place.html'
})
export class DeleteFavoriteComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private favoritePlaceService: FavoritePlaceService) {
  }

  delete() {
    this.favoritePlaceService.deleteFavoritePlace(this.data.placeId).subscribe();
  }
}
