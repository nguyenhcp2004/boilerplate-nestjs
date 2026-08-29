export interface IEmailJob {
  email: string;
  /**
   * Action URL from the better-auth email callback — contains the signed
   * token. Better-auth owns token generation; the mail pipeline only
   * delivers it.
   */
  url: string;
}
