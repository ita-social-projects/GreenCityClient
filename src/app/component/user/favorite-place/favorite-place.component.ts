import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatIconRegistry} from '@angular/material';
import {FavoritePlaceService} from '../../../service/favorite-place/favorite-place.service';
import {PlaceService} from '../../../service/place/place.service';
import {FavoritePlace} from '../../../model/favorite-place/favorite-place';
import {frontMailLink} from '../../../links';
import {DomSanitizer} from '@angular/platform-browser';

export interface DialogData {
  id: number;
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
    console.log('fp show all');
    this.favoritePlaceService.findAllByUserEmail().subscribe((res) => this.favoritePlaces = res);
  }

  delete(id: number) {// delete from table
    console.log('fp delete');
    this.favoritePlaceService.deleteFavoritePlace(id).subscribe(() => this.showAll());
  }

  openDialog(idElement: number, nameElement: string): void {
    const dialogRef = this.dialog.open(EditFavoriteNameComponent, {
        width: '550px',
        data: {id: idElement, name: nameElement}

      })
    ;

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
      this.showAll();
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
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
    console.log('fp update id=' + this.data.id + ' name=' + name);
    this.favoritePlaceService.updateFavoritePlace(new FavoritePlace(this.data.id, name)).subscribe();
  }

  clickSubmit() {
    document.getElementById('closeButton').click();
  }

}
