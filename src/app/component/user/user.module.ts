import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatRadioModule } from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { EffectsModule } from '@ngrx/effects';
import { AgmCoreModule } from '@agm/core';
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
} from './components';
import { CustomLastPipe } from '../../pipe/custom-last-pipe/custom-first.pipe';
import { ShowFirstNLettersPipe } from '../../pipe/show-first-n-letters/show-first-n-letters.pipe';
import { ShowFirstNPipe } from '../../pipe/show-first-n-pipe/show-first-n.pipe';
import { UncheckedFirstPipe } from '../../pipe/unchecked-first-pipe/unchecked-first.pipe';
import { AlphabeticalPipePipe } from '../../pipe/alphabetical-pipe/alphabetical-pipe.pipe';
import { SharedModule } from '../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { UserEffects } from './store/user.effects';
import { UserSelectors } from './store/user.selectors';
import { UserComponent } from './user.component';
import { CalendarWeekComponent } from './components/profile/calendar/calendar-week/calendar-week.component';
import { AllHabitsComponent } from './components/habit/all-habits/all-habits.component';
import { HabitsListViewComponent } from './components/habit/all-habits/components/habits-list-view/habits-list-view.component';
import { HabitsGalleryViewComponent } from './components/habit/all-habits/components/habits-gallery-view/habits-gallery-view.component';
import { EditProfileFormBuilder } from '@global-user/components/profile/edit-profile/edit-profile-form-builder';

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
    AllHabitsComponent,
    HabitsGalleryViewComponent,
    HabitsListViewComponent,
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
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB3xs7Kczo46LFcQRFKPMdrE0lU4qsR_S4',
      libraries: ['places']
    }),
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
    UserSelectors,
    EditProfileFormBuilder
  ]
})
export class UserModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
