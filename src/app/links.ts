import { environment } from 'src/environments/environment';

// back-end
export const mainLink = environment.backendLink;
export const mockedBackApi = 'http://localhost:3000';

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
export const factLink = mainLink + 'facts/';
export const habitFactRandomLink = factLink + 'random/';
export const adviceLink = mainLink + 'advices/';
export const adviceRandomLink = adviceLink + 'random/';
export const habitStatisticLink = mainLink + 'habit/statistic/';
export const habitLink = '/habits/statistic';
export const achievementLink = mainLink + 'achievements';
export const latestNewsLink = mainLink + 'econews/newest';
export const subscriptionLink = mainLink + 'newsSubscriber';

// front-end
export const frontMailLink = environment.frontendLink;
export const frontAuthLink = frontMailLink + 'auth/';
export const preparedImageForCreateEcoNews = 'https://cdn3.iconfinder.com/data/icons/popular-services-brands/512/angular-js-256.png';