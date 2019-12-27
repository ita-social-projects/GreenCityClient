import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { router } from './router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { MapComponent } from './component/user/map/map.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SignUpComponent } from './component/user/auth/sign-up/sign-up.component';
import { NavBarComponent } from './component/user/nav-bar/nav-bar.component';
import { GeneralComponent } from './component/general/general.component';
import { AuthComponent } from './component/user/auth/auth.component';
import { SignInComponent } from './component/user/auth/sign-in/sign-in.component';
import { SubmitEmailComponent } from './component/user/auth/submit-email/submit-email.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from './component/user/_modal/modal.module';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule
} from '@angular/common/http';
import { ProposeCafeComponent } from './component/user/propose-cafe/propose-cafe.component';
import { AdminModule } from './component/admin/admin.module';
import { NgFlashMessagesModule } from 'ng-flash-messages';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilterComponent } from './component/filter/filter.component';
import {
  DeleteFavoriteComponent,
  EditFavoriteNameComponent,
  FavoritePlaceComponent
} from './component/user/favorite-place/favorite-place.component';
import { AuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { AgmDirectionModule } from 'agm-direction';
import { DatePipe } from '@angular/common';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatDialogRef,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatTableModule,
  MatTreeModule
} from '@angular/material';

import { HabitChartComponent } from './component/user/habit/habit-trackers/habit-tracker/habit-chart/habit-chart.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { Ng5SliderModule } from 'ng5-slider';
import { provideConfig } from './config/GoogleAuthConfig';
import { RestoreComponent } from './component/user/restore/restore.component';
import { RestoreFormComponent } from './component/user/restore-form/restore-form.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { FileUploadModule } from 'ng2-file-upload';
import { AddCommentComponent } from './component/user/add-comment/add-comment.component';
import { RatingModule } from 'ngx-bootstrap';
import { PhotoUploadComponent } from './component/user/photo-upload/photo-upload.component';
import { UserSettingComponent } from './component/user/user-setting/user-setting.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserLogComponent } from './component/user/habit/user-log-component/user-log.component';
import { ButtonComponent } from './component/user/habit/button-component/button.component';
import { HabitTrackersComponent } from './component/user/habit/habit-trackers/habit-trackers.component';
import { HabitItemComponent } from './component/user/habit/habit-trackers/habit-tracker/habit-estimation/habit-item/habit-item.component';
import { HabitTrackerComponent } from './component/user/habit/habit-trackers/habit-tracker/habit-tracker.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UserHabitPageComponent } from './component/user/habit/user-habit-page/user-habit-page.component';
import { LowerNavBarComponent } from './component/user/lower-nav-bar/lower-nav-bar.component';
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
import { FooterComponent } from './component/general/homepage/footer/footer.component';
import { EcoEventsComponent } from './component/general/homepage/eco-events/eco-events.component';
import { TipsListComponent } from './component/general/homepage/useful-tips/tips-list/tips-list.component';
import { TipsCardComponent } from './component/general/homepage/useful-tips/tips-card/tips-card.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { NgxPageScrollModule } from 'ngx-page-scroll';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  declarations: [
    AppComponent,
    GeneralComponent,
    SignUpComponent,
    NavBarComponent,
    HabitFactComponent,
    HabitTitleComponent,
    HabitTrackerDateComponent,
    AuthComponent,
    SignInComponent,
    SubmitEmailComponent,
    MapComponent,
    ProposeCafeComponent,
    FilterComponent,
    FavoritePlaceComponent,
    EditFavoriteNameComponent,
    DeleteFavoriteComponent,
    RestoreComponent,
    RestoreFormComponent,
    PhotoUploadComponent,
    AddCommentComponent,
    UserSettingComponent,
    HabitTrackersComponent,
    UserLogComponent,
    ButtonComponent,
    UserHabitPageComponent,
    LowerNavBarComponent,
    GoalItemComponent,
    GoalListComponent,
    AddGoalButtonComponent,
    GoalContainerComponent,
    UserSidebarComponent,
    LowerNavBarComponent,
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
    FooterComponent,
    EcoEventsComponent,
    TipsListComponent,
    TipsCardComponent,
  ],
  imports: [
    BrowserModule,
    SwiperModule,
    NgxPageScrollModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(router),
    HttpClientModule,
    SocialLoginModule,
    FormsModule,
    FileUploadModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC7q2v0VgRy60dAoItfv3IJhfJQEEoeqCI',
      libraries: ['places', 'geometry']
    }),
    AgmDirectionModule,
    Ng2SearchPipeModule,
    AdminModule,
    NgFlashMessagesModule.forRoot(),
    NgSelectModule,
    MatTableModule,
    MatIconModule,
    MDBBootstrapModule,
    ModalModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatTreeModule,
    Ng5SliderModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    MatCardModule,
    RatingModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    DragDropModule,
    NgbModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [
    ProposeCafeComponent,
    FavoritePlaceComponent,
    EditFavoriteNameComponent,
    RestoreComponent,
    DeleteFavoriteComponent,
    UserSettingComponent,
    AddCommentComponent
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

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(
    httpClient,
    './assets/i18n/',
    '.json'
  );
}
