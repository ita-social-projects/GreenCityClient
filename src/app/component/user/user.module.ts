import { NgModule } from '@angular/core';
import {CoreModule} from '../core/core.module';
import {AchievementItemComponent} from './user-achievements/achievement-item/achievement-item.component';
import {AchievementListComponent} from './user-achievements/achievement-list/achievement-list.component';
import {UserAchievementsComponent} from './user-achievements/achievements-container/user-achievements.component';
import {NewAchievementModalComponent} from './user-achievements/new-achievement-modal/new-achievement-modal.component';


@NgModule({
  declarations: [
    AchievementItemComponent,
    AchievementListComponent,
    UserAchievementsComponent,
    NewAchievementModalComponent
  ],
  imports: [
    CoreModule
  ],
  providers: []
})

export class UserModule { }
