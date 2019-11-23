// back-end
// export const mainLink = 'https://greencity-lv448.herokuapp.com/';
export const mainLink = 'http://localhost:8080/';

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
export const adviceLink = mainLink + 'advices/';
export const adviceRandomLink = adviceLink + 'random/';
export const habitStatisticLink = mainLink + 'habit/statistic/';
export const habitLink = '/habits/statistic';

// front-end
// export const frontMailLink = 'https://nomadness.github.io/GreenCityClient/';
export const frontMailLink = 'http://localhost:4200/';
export const frontAuthLink = frontMailLink + 'auth/';
