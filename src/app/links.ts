import { environment } from 'src/environments/environment';
import {HabitFactDto} from './model/habit-fact/HabitFactDto';

// back-end
export const mainLink = environment.backendLink;

export const userOwnSecurityLink = mainLink + 'ownSecurity/';
export const userOwnSignUpLink = userOwnSecurityLink + 'signUp/';
export const userOwnSignInLink = userOwnSecurityLink + 'signIn/';
export const updateAccessTokenLink = userOwnSecurityLink + 'updateAccessToken/';
export const categoryLink = mainLink + 'category/';
export const userLink = mainLink + 'user';
export const placeLink = mainLink + 'place/';
export const favoritePlaceLink = mainLink + 'favorite_place/';
export const googleSecurityLink = mainLink + 'googleSecurity/';
export const userInitialsLink = userLink + '/initials/';
export const factLink = mainLink + 'fact/';
export const habitFactRandomLink = factLink + 'random/';
export const adviceLink = mainLink + 'advices/';
export const adviceRandomLink = adviceLink + 'random/';
export const habitStatisticLink = mainLink + 'habit/statistic/';
export const habitLink = '/habits/statistic';

// front-end
export const frontMailLink = environment.frontendLink;
export const frontAuthLink = frontMailLink + 'auth/';
