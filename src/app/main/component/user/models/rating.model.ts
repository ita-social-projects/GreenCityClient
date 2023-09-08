export interface UserRatingModel {
  userId: number;
  rating: number;
}

export enum ratingPoints {
  acquiredHabitPer14Days = 20,
  acquiredHabitPer21Days = 30,
  acquiredHabitPer30PlusDays = 40,
  daysOfHabitInProgress = 1,
  createdNews = 20,
  AddedTipsAndTricks = 10,
  CommentOrReply = 2,
  likeCommentOrReply = 1,
  ShareNewsOrTipsAndTricks = 10,
  first5Achievements = 20,
  first10Achievements = 30,
  first15Achievements = 40,
  first20Achievements = 50
}
