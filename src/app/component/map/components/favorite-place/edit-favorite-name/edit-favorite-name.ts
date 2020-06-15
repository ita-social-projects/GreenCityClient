import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FavoritePlaceService } from '../../../../../service/favorite-place/favorite-place.service';
import { FavoritePlace } from '../../../../../model/favorite-place/favorite-place';
import { DialogData } from '../favorite-place.component';

@Component({
  selector: 'app-edit-name',
  templateUrl: './edit-name.html'
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
