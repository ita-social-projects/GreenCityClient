export class AccessToken {
  private _accessToken: string;


  constructor() {
  }

  get accessToken(): string {
    return this._accessToken;
  }

  set accessToken(value: string) {
    this._accessToken = value;
  }
}
