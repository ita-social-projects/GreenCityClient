import { NgModule } from '@angular/core';
import {
  AddNewHabitModalComponent,
  AlreadyChosenComponent,
  AvailableToChooseComponent,
  ConfirmationModalComponent,
  HabitCardComponent,
  ButtonComponent,
  HabitTrackersComponent,
  HabitTrackerComponent,
  AdviceComponent,
  HabitChartComponent,
  HabitEstimationComponent,
  DayEstimationComponent,
  HabitItemComponent,
  HabitItemListComponent,
  HabitFactComponent,
  HabitTitleComponent,
  HabitTrackerDateComponent,
  UserHabitPageComponent,
  UserLogComponent,
  ProfileComponent,
  AchievementsFriendsComponent,
  CalendarComponent,
  EcoPlacesComponent,
  ProfileCardsComponent,
  ProfileDashboardComponent,
  OneHabitComponent,
  ProfileWidgetComponent,
  ProfileHeaderComponent,
  ProfileProgressComponent,
  ShoppingListComponent,
  AchievementItemComponent,
  AchievementListComponent,
  UserAchievementsComponent,
  NewAchievementModalComponent,
  UserSidebarComponent,
  UserSettingComponent,
  AddGoalComponent,
  AddGoalListComponent,
  AddCustomGoalComponent,
  AddGoalItemComponent,
  UpdateGoalStatusListComponent,
  UpdateGoalItemComponent,
  AddGoalButtonComponent,
  GoalContainerComponent,
  GoalItemComponent,
  GoalListComponent,
  EditProfileComponent,
  PersonalPhotoComponent,
  SocialNetworksComponent,
  ProfilePrivacyComponent
} from './components';
import { CommonModule } from '@angular/common';
import { CustomLastPipe } from '../../pipe/custom-last-pipe/custom-first.pipe';
import { ShowFirstNLettersPipe } from '../../pipe/show-first-n-letters/show-first-n-letters.pipe';
import { ShowFirstNPipe } from '../../pipe/show-first-n-pipe/show-first-n.pipe';
import { UncheckedFirstPipe } from '../../pipe/unchecked-first-pipe/unchecked-first.pipe';
import { AlphabeticalPipePipe } from '../../pipe/alphabetical-pipe/alphabetical-pipe.pipe';
import { MatButtonModule, MatRadioModule } from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './store/user.effects';
import { UserSelectors } from './store/user.selectors';
import { UserComponent } from './user.component';
import { CalendarWeekComponent } from './components/profile/calendar/calendar-week/calendar-week.component';

@NgModule({
  declarations: [
    UserComponent,
    ProfileCardsComponent,
    ProfileDashboardComponent,
    OneHabitComponent,
    AchievementItemComponent,
    AchievementListComponent,
    UserAchievementsComponent,
    NewAchievementModalComponent,
    AddGoalComponent,
    AddGoalListComponent,
    AddCustomGoalComponent,
    AddGoalItemComponent,
    UpdateGoalStatusListComponent,
    UpdateGoalItemComponent,
    AddGoalButtonComponent,
    GoalContainerComponent,
    GoalItemComponent,
    GoalListComponent,
    UserSettingComponent,
    UserSidebarComponent,
    UserHabitPageComponent,
    ButtonComponent,
    UserLogComponent,
    HabitTrackersComponent,
    AdviceComponent,
    HabitChartComponent,
    HabitEstimationComponent,
    DayEstimationComponent,
    HabitItemComponent,
    HabitItemListComponent,
    HabitFactComponent,
    HabitTitleComponent,
    HabitTrackerDateComponent,
    HabitTrackerComponent,
    HabitCardComponent,
    AvailableToChooseComponent,
    AlreadyChosenComponent,
    AddNewHabitModalComponent,
    ConfirmationModalComponent,
    CustomLastPipe,
    ShowFirstNLettersPipe,
    ShowFirstNPipe,
    UncheckedFirstPipe,
    AlphabeticalPipePipe,
    ProfileWidgetComponent,
    ProfileHeaderComponent,
    ProfileProgressComponent,
    ProfileComponent,
    AchievementsFriendsComponent,
    EcoPlacesComponent,
    ShoppingListComponent,
    CalendarComponent,
    EditProfileComponent,
    PersonalPhotoComponent,
    SocialNetworksComponent,
    ProfilePrivacyComponent,
    CalendarWeekComponent
  ],
  imports: [
    EffectsModule.forFeature([UserEffects]),
    UserRoutingModule,
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatRadioModule,
    DragDropModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  providers: [
    UserSelectors
  ]
})
export class UserModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
