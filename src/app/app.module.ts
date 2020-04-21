import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './component/user/auth/sign-up/sign-up.component';
import { GeneralComponent } from './component/general/general.component';
import { AuthComponent } from './component/user/auth/auth.component';
import { SignInComponent } from './component/user/auth/sign-in/sign-in.component';
import { SubmitEmailComponent } from './component/user/auth/submit-email/submit-email.component';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule
} from '@angular/common/http';
import { ProposeCafeComponent } from './component/core/propose-cafe/propose-cafe.component';
import { AdminModule } from './component/admin/admin.module';
import { NgFlashMessagesModule } from 'ng-flash-messages';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { DatePipe } from '@angular/common';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatButtonModule,
  MatDialogModule,
  MatDialogRef,
  MatFormFieldModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatTableModule,
  MatTreeModule
} from '@angular/material';
import { HabitChartComponent } from './component/user/habit/habit-trackers/habit-tracker/habit-chart/habit-chart.component';
import { provideConfig } from './config/GoogleAuthConfig';
import { RestoreComponent } from './component/user/restore/restore.component';
import { RestoreFormComponent } from './component/user/restore-form/restore-form.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { UserSettingComponent } from './component/user/user-setting/user-setting.component';
import { UserLogComponent } from './component/user/habit/user-log-component/user-log.component';
import { ButtonComponent } from './component/user/habit/button-component/button.component';
import { HabitTrackersComponent } from './component/user/habit/habit-trackers/habit-trackers.component';
import { HabitItemComponent } from './component/user/habit/habit-trackers/habit-tracker/habit-estimation/habit-item/habit-item.component';
import { HabitTrackerComponent } from './component/user/habit/habit-trackers/habit-tracker/habit-tracker.component';
import { UserHabitPageComponent } from './component/user/habit/user-habit-page/user-habit-page.component';
import { HabitEstimationComponent } from './component/user/habit/habit-trackers/habit-tracker/habit-estimation/habit-estimation.component';
import { AdviceComponent } from './component/user/habit/habit-trackers/habit-tracker/advice/advice.component';
import { GoalItemComponent } from './component/user/user-goals/goal-item/goal-item.component';
import { GoalListComponent } from './component/user/user-goals/goal-list/goal-list.component';
import { AddGoalButtonComponent } from './component/user/user-goals/add-goal-button/add-goal-button.component';
import { GoalContainerComponent } from './component/user/user-goals/goal-container/goal-container.component';
import { UserSidebarComponent } from './component/user/user-sidebar/user-sidebar.component';
import { ShowFirstNPipe } from './pipe/show-first-n-pipe/show-first-n.pipe';
import { UncheckedFirstPipe } from './pipe/unchecked-first-pipe/unchecked-first.pipe';
import { AlphabeticalPipePipe } from './pipe/alphabetical-pipe/alphabetical-pipe.pipe';
import { AddNewHabitModalComponent } from './component/user/habit/add-new-habit/add-new-habit-modal/add-new-habit-modal.component';
import { AlreadyChosenComponent } from './component/user/habit/add-new-habit/already-chosen/already-chosen.component';
import { HabitCardComponent } from './component/user/habit/add-new-habit/habit-card/habit-card.component';
import { AvailableToChooseComponent } from './component/user/habit/add-new-habit/available-to-choose/available-to-choose.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ConfirmationModalComponent } from './component/user/habit/add-new-habit/confirmation-modal/confirmation-modal.component';
import { InterceptorService } from './service/interceptors/interceptor.service';
// tslint:disable-next-line:import-spacing
import { DayEstimationComponent }
  from './component/user/habit/habit-trackers/habit-tracker/habit-estimation/day-estimation/day-estimation.component';
// tslint:disable-next-line:import-spacing
import { HabitItemListComponent }
  from './component/user/habit/habit-trackers/habit-tracker/habit-estimation/habit-item-list/habit-item-list.component';
import { HabitFactComponent } from './component/user/habit/habit-trackers/habit-tracker/habit-fact/habit-fact.component';
import { HabitTitleComponent } from './component/user/habit/habit-trackers/habit-tracker/habit-title/habit-title.component';
// tslint:disable-next-line:max-line-length
import { HabitTrackerDateComponent } from './component/user/habit/habit-trackers/habit-tracker/habit-tracker-date/habit-tracker-date.component';
import { NewAchievementModalComponent } from './component/user/user-achievements/new-achievement-modal/new-achievement-modal.component';
import { AchievementListComponent } from './component/user/user-achievements/achievement-list/achievement-list.component';
import { AchievementItemComponent } from './component/user/user-achievements/achievement-item/achievement-item.component';
import { UserAchievementsComponent } from './component/user/user-achievements/achievements-container/user-achievements.component';
import { AddCustomGoalComponent } from './component/user/user-goals/add-goal/add-goal-list/add-custom-goal/add-custom-goal.component';
import { ShowFirstNLettersPipe } from './pipe/show-first-n-letters/show-first-n-letters.pipe';
import { CustomLastPipe } from './pipe/custom-last-pipe/custom-first.pipe';
import { AddGoalItemComponent } from './component/user/user-goals/add-goal/add-goal-list/add-goal-item/add-goal-item.component';
import { AddGoalComponent } from './component/user/user-goals/add-goal/add-goal.component';
import { AddGoalListComponent } from './component/user/user-goals/add-goal/add-goal-list/add-goal-list.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
// tslint:disable-next-line:max-line-length
import { UpdateGoalStatusListComponent } from './component/user/user-goals/add-goal/update-goal-status-list/update-goal-status-list.component';
// tslint:disable-next-line:max-line-length
import { UpdateGoalItemComponent } from './component/user/user-goals/add-goal/update-goal-status-list/update-goal-item/update-goal-item.component';
import { HomepageComponent } from './component/general/homepage/homepage/homepage.component';
import { StatRowComponent } from './component/general/homepage/stat-row/stat-row.component';
import { StatRowsComponent } from './component/general/homepage/stat-rows/stat-rows.component';
import { SubscribeComponent } from './component/general/homepage/subscribe/subscribe.component';
import { EcoEventsComponent } from './component/general/homepage/eco-events/eco-events.component';
import { TipsListComponent } from './component/general/homepage/useful-tips/tips-list/tips-list.component';
import { TipsCardComponent } from './component/general/homepage/useful-tips/tips-card/tips-card.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { InputcolorDirective } from './directives/inputcolor.directive';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CoreModule } from './component/core/core.module';
import { EcoNewsModule } from './component/eco-news/eco-news.module';
import { AuthModule } from './component/auth/auth.module';
import { MapModule } from './component/map/map.module';
import { NewFooterComponent } from './component/core/new-footer/new-footer.component';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  declarations: [
    AppComponent,
    GeneralComponent,
    SignUpComponent,
    HabitFactComponent,
    HabitTitleComponent,
    HabitTrackerDateComponent,
    AuthComponent,
    SignInComponent,
    SubmitEmailComponent,
    RestoreComponent,
    RestoreFormComponent,
    UserSettingComponent,
    HabitTrackersComponent,
    UserLogComponent,
    ButtonComponent,
    UserHabitPageComponent,
    GoalItemComponent,
    GoalListComponent,
    AddGoalButtonComponent,
    GoalContainerComponent,
    UserSidebarComponent,
    ShowFirstNPipe,
    AlphabeticalPipePipe,
    AddNewHabitModalComponent,
    AlreadyChosenComponent,
    HabitCardComponent,
    AvailableToChooseComponent,
    HabitTrackerComponent,
    HabitEstimationComponent,
    DayEstimationComponent,
    HabitItemComponent,
    HabitChartComponent,
    AdviceComponent,
    HabitItemComponent,
    HabitItemListComponent,
    AddGoalComponent,
    AddGoalListComponent,
    AddGoalItemComponent,
    UpdateGoalStatusListComponent,
    AddCustomGoalComponent,
    UpdateGoalItemComponent,
    ShowFirstNLettersPipe,
    UncheckedFirstPipe,
    CustomLastPipe,
    HabitItemListComponent,
    UserAchievementsComponent,
    AchievementItemComponent,
    AchievementListComponent,
    NewAchievementModalComponent,
    HabitItemListComponent,
    ConfirmationModalComponent,
    HomepageComponent,
    StatRowComponent,
    StatRowsComponent,
    SubscribeComponent,
    EcoEventsComponent,
    TipsListComponent,
    TipsCardComponent,
    InputcolorDirective,
    NewFooterComponent
  ],
  imports: [
    MatDialogModule,
    AuthModule,
    CoreModule,
    EcoNewsModule,
    InfiniteScrollModule,
    BrowserModule,
    SwiperModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SocialLoginModule,
    FormsModule,
    AdminModule,
    NgFlashMessagesModule.forRoot(),
    ReactiveFormsModule,
    MatSliderModule,
    MatTreeModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    MatSelectModule,
    MatRadioModule,
    DragDropModule,
    MapModule,
  ],
  entryComponents: [
    ProposeCafeComponent,
    RestoreComponent,
    UserSettingComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    { provide: MatDialogRef, useValue: {} },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: false }
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
