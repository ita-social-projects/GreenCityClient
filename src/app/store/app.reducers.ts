import * as fromEcoNews from './../component/eco-news/store/eco-news.reducers';
import * as fromAuth from './../component/auth/store/auth.reducers';
import * as fromUser from './../component/user/store/user.reducers';

export interface AppState {
  authModule: fromAuth.State;
  ecoNewsModule: fromEcoNews.State;
  userModule: fromUser.State;
}

export const reducers = {
  authModule: fromAuth.authReducers,
  ecoNewsModule: fromEcoNews.ecoNewsReducers,
  userModule: fromUser.UserReducers
};
