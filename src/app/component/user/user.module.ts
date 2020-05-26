import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { AchievementItemComponent } from './user-achievements/achievement-item/achievement-item.component';
import { AchievementListComponent } from './user-achievements/achievement-list/achievement-list.component';
import { UserAchievementsComponent } from './user-achievements/achievements-container/user-achievements.component';
import { NewAchievementModalComponent } from './user-achievements/new-achievement-modal/new-achievement-modal.component';
import { AddGoalComponent } from './user-goals/add-goal/add-goal.component';
import { UpdateGoalStatusListComponent } from './user-goals/add-goal/update-goal-status-list/update-goal-status-list.component';
import { UpdateGoalItemComponent } from './user-goals/add-goal/update-goal-status-list/update-goal-item/update-goal-item.component';
import { AddGoalListComponent } from './user-goals/add-goal/add-goal-list/add-goal-list.component';
import { AddCustomGoalComponent } from './user-goals/add-goal/add-goal-list/add-custom-goal/add-custom-goal.component';
import { AddGoalItemComponent } from './user-goals/add-goal/add-goal-list/add-goal-item/add-goal-item.component';
import { AddGoalButtonComponent } from './user-goals/add-goal-button/add-goal-button.component';
import { GoalContainerComponent } from './user-goals/goal-container/goal-container.component';
import { GoalItemComponent } from './user-goals/goal-item/goal-item.component';
import { GoalListComponent } from './user-goals/goal-list/goal-list.component';
import { UserSettingComponent } from './user-setting/user-setting.component';
import { UserSidebarComponent } from './user-sidebar/user-sidebar.component';
import { UserHabitPageComponent } from './habit/user-habit-page/user-habit-page.component';
import { ButtonComponent } from './habit/button-component/button.component';
import { UserLogComponent } from './habit/user-log-component/user-log.component';
import { HabitTrackersComponent } from './habit/habit-trackers/habit-trackers.component';
import { AdviceComponent } from './habit/habit-trackers/habit-tracker/advice/advice.component';
import { HabitChartComponent } from './habit/habit-trackers/habit-tracker/habit-chart/habit-chart.component';
import { HabitEstimationComponent } from './habit/habit-trackers/habit-tracker/habit-estimation/habit-estimation.component';
import { DayEstimationComponent } from './habit/habit-trackers/habit-tracker/habit-estimation/day-estimation/day-estimation.component';
import { HabitItemComponent } from './habit/habit-trackers/habit-tracker/habit-estimation/habit-item/habit-item.component';
import { HabitItemListComponent } from './habit/habit-trackers/habit-tracker/habit-estimation/habit-item-list/habit-item-list.component';
import { HabitFactComponent } from './habit/habit-trackers/habit-tracker/habit-fact/habit-fact.component';
import { HabitTitleComponent } from './habit/habit-trackers/habit-tracker/habit-title/habit-title.component';
import { HabitTrackerDateComponent } from './habit/habit-trackers/habit-tracker/habit-tracker-date/habit-tracker-date.component';
import { HabitTrackerComponent } from './habit/habit-trackers/habit-tracker/habit-tracker.component';
import { HabitCardComponent } from './habit/add-new-habit/habit-card/habit-card.component';
import { AvailableToChooseComponent } from './habit/add-new-habit/available-to-choose/available-to-choose.component';
import { AlreadyChosenComponent } from './habit/add-new-habit/already-chosen/already-chosen.component';
import { AddNewHabitModalComponent } from './habit/add-new-habit/add-new-habit-modal/add-new-habit-modal.component';
import { CommonModule } from '@angular/common';
import { CustomLastPipe } from '../../pipe/custom-last-pipe/custom-first.pipe';
import { ShowFirstNLettersPipe } from '../../pipe/show-first-n-letters/show-first-n-letters.pipe';
import { ShowFirstNPipe } from '../../pipe/show-first-n-pipe/show-first-n.pipe';
import { UncheckedFirstPipe } from '../../pipe/unchecked-first-pipe/unchecked-first.pipe';
import { AlphabeticalPipePipe } from '../../pipe/alphabetical-pipe/alphabetical-pipe.pipe';
import { MatButtonModule, MatRadioModule } from '@angular/material';
import { ConfirmationModalComponent } from './habit/add-new-habit/confirmation-modal/confirmation-modal.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../shared/shared.module';
import { ProfileHeaderComponent } from './profile/profile-widget/profile-header/profile-header.component';
import { ProfileProgressComponent } from './profile/profile-widget/profile-progress/profile-progress.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileWidgetComponent } from "./profile/profile-widget/profile-widget.component";
import { ProfileDashboardComponent } from "./profile/profile-dashboard/profile-dashboard.component";
import { OneHabitComponent } from "./profile/profile-dashboard/one-habit/one-habit.component";


@NgModule({
  declarations: [
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
    ProfileComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    MatButtonModule,
    MatRadioModule,
    DragDropModule,
  ],
  providers: [],
})
export class UserModule {}
