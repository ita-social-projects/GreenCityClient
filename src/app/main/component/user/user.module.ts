import { environment } from '@environment/environment';
import { UserSharedModule } from './components/shared/user-shared.module';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AgmCoreModule } from '@agm/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
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
  UserLogComponent,
  ProfileComponent,
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
  EditProfileComponent,
  PersonalPhotoComponent,
  SocialNetworksComponent
} from './components';
import { ShowFirstNLettersPipe } from '../../pipe/show-first-n-letters/show-first-n-letters.pipe';
import { ShowFirstNPipe } from '../../pipe/show-first-n-pipe/show-first-n.pipe';
import { UncheckedFirstPipe } from '../../pipe/unchecked-first-pipe/unchecked-first.pipe';
import { AlphabeticalPipePipe } from '../../pipe/alphabetical-pipe/alphabetical-pipe.pipe';
import { SharedMainModule } from '../shared/shared-main.module';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { FirstStringWordPipe } from '@pipe/first-string-word/first-string-word.pipe';
import { CalendarWeekComponent } from './components/profile/calendar/calendar-week/calendar-week.component';
import { AllHabitsComponent } from './components/habit/all-habits/all-habits.component';
import { HabitsListViewComponent } from './components/habit/all-habits/components/habits-list-view/habits-list-view.component';
import { EditProfileFormBuilder } from '@global-user/components/profile/edit-profile/edit-profile-form-builder';
import { UsersFriendsComponent } from './components/profile/users-friends/users-friends.component';
import { UsersAchievementsComponent } from './components/profile/users-achievements/users-achievements.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HabitProgressComponent } from './components/habit/add-new-habit/habit-progress/habit-progress.component';
import { HabitInviteFriendsComponent } from './components/habit/add-new-habit/habit-invite-friends/habit-invite-friends.component';
import { HabitDurationComponent } from './components/habit/add-new-habit/habit-duration/habit-duration.component';
import { HabitEditShoppingListComponent } from './components/habit/add-new-habit/habit-edit-shopping-list/habit-edit-shopping-list.component';
import { HabitCalendarComponent } from './components/habit/add-new-habit/habit-calendar/habit-calendar.component';
import { AddNewHabitComponent } from './components/habit/add-new-habit/add-new-habit.component';
import { GradientDirective } from './components/habit/add-new-habit/habit-duration/gradient.directive';
import { FriendDashboardComponent } from './components/profile/users-friends/friend-dashboard/friend-dashboard.component';
import { AllFriendsComponent } from './components/profile/users-friends/friend-dashboard/all-friends/all-friends.component';
import { RecommendedFriendsComponent } from './components/profile/users-friends/friend-dashboard/recommended-friends/recommended-friends.component';
import { FriendItemComponent } from './components/profile/users-friends/friend-dashboard/friend-item/friend-item.component';
import { FriendRequestsComponent } from './components/profile/users-friends/friend-dashboard/friend-requests/friend-requests.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { HabitInviteFriendsPopUpComponent } from './components/habit/add-new-habit/habit-invite-friends/habit-invite-friends-pop-up/habit-invite-friends-pop-up.component';
import { MatTabsModule } from '@angular/material/tabs';
import { OneNewsComponent } from './components/profile/profile-dashboard/one-news/one-news.component';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FriendProfilePageComponent } from './components/profile/users-friends/friend-dashboard/friend-profile-page/friend-profile-page.component';
import { FriendProfileDashboardComponent } from './components/profile/users-friends/friend-dashboard/friend-profile-page/friend-profile-dashboard/friend-profile-dashboard.component';
import { SetCountComponent } from './components/profile/profile-dashboard/set-count/set-count.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { HabitsWidgetComponent } from './components/habit/add-new-habit/habits-widget/habits-widget.component';
import { AddEditCustomHabitComponent } from './components/habit/add-edit-custom-habit/add-edit-custom-habit.component';
import { QuillModule } from 'ngx-quill';

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
    UserSettingComponent,
    UserSidebarComponent,
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
    ShowFirstNLettersPipe,
    ShowFirstNPipe,
    UncheckedFirstPipe,
    FirstStringWordPipe,
    AlphabeticalPipePipe,
    ProfileWidgetComponent,
    ProfileHeaderComponent,
    ProfileProgressComponent,
    ProfileComponent,
    EcoPlacesComponent,
    ShoppingListComponent,
    CalendarComponent,
    EditProfileComponent,
    PersonalPhotoComponent,
    SocialNetworksComponent,
    AllHabitsComponent,
    HabitsListViewComponent,
    CalendarWeekComponent,
    UsersFriendsComponent,
    UsersAchievementsComponent,
    AddNewHabitComponent,
    HabitProgressComponent,
    HabitInviteFriendsComponent,
    HabitDurationComponent,
    HabitEditShoppingListComponent,
    HabitCalendarComponent,
    GradientDirective,
    FriendDashboardComponent,
    AllFriendsComponent,
    RecommendedFriendsComponent,
    FriendItemComponent,
    FriendRequestsComponent,
    HabitInviteFriendsPopUpComponent,
    OneNewsComponent,
    FriendProfilePageComponent,
    FriendProfileDashboardComponent,
    SetCountComponent,
    HabitsWidgetComponent,
    AddEditCustomHabitComponent
  ],
  imports: [
    NgbModule,
    GooglePlaceModule,
    UserRoutingModule,
    CommonModule,
    SharedMainModule,
    SharedModule,
    MatButtonModule,
    MatRadioModule,
    MatSliderModule,
    MatTooltipModule,
    DragDropModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: environment.agmCoreModuleApiKey,
      libraries: ['places']
    }),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    }),
    InfiniteScrollModule,
    UserSharedModule,
    MatTabsModule,
    NgxPaginationModule,
    QuillModule.forRoot()
  ],
  providers: [EditProfileFormBuilder]
})
export class UserModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
