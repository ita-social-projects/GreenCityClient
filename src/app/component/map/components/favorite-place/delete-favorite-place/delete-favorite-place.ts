import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FavoritePlaceService } from '../../../../../service/favorite-place/favorite-place.service';
import { DialogData } from '../favorite-place.component';

@Component({
  selector: 'app-delete-favorite-place',
  templateUrl: './delete-favorite-place.html'
})
export class DeleteFavoriteComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private favoritePlaceService: FavoritePlaceService) {
  }

  delete() {
    this.favoritePlaceService.deleteFavoritePlace(this.data.placeId).subscribe();
  }
}
