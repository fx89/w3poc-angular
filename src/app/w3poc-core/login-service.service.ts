import { Injectable } from '@angular/core';
import { ConfigService } from './config-service.service';
import { getCookie, setCookie } from './CookieUtils';

const MIN_TOKEN_LENGTH : number = 20
export const ID_TOKEN_PARAM_NAME : string = "id_token"
const LAST_PAGE_VISITED_PARAM_NAME : string = "last-page-visited"

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginUrl : string | any
  private idToken : string | null = sessionStorage.getItem(ID_TOKEN_PARAM_NAME)

  constructor(private config:ConfigService) {
      this.loginUrl = this.compileLoginUrl(
          this.config.getAttributeValue("loginFormUrl"),
          this.config.getAttributeValue("frontendUrl"),
          this.config.getAttributeValue("authCompleteSubpath")
      )
  }

  private compileLoginUrl(loginFormURL:string, frontendURL:string, authCompleteSubpath:string) : string {
      return loginFormURL + "&redirect_uri=" + frontendURL + "/" + authCompleteSubpath
  }

  public setIdToken(idToken : string | null) {
      sessionStorage.setItem(ID_TOKEN_PARAM_NAME, "" + idToken)
      this.idToken = idToken
  }

  public getIdToken() : string | null {
      return this.idToken
  }

  public isLoggedIn() : boolean {
      return !this.isNotLoggedIn() // no copy/paste of the code in isNotLoggedIn()
  }

  public isNotLoggedIn() : boolean {
      return this.idToken == undefined || this.idToken == 'undefined'
  }

  public redirectToLoginForm() {
      this.purgeLoginToken()
      this.recordLastVisitedPage()
      document.location.href = this.loginUrl
  }

  public validateIdToken(idToken : string | any) : boolean {
        return !(idToken == null || idToken == undefined || idToken.length < MIN_TOKEN_LENGTH)
  }

  public purgeLoginToken() {
        sessionStorage.setItem(ID_TOKEN_PARAM_NAME, undefined)
        this.idToken = undefined
  }

  public recordLastVisitedPage() {
        sessionStorage.setItem(LAST_PAGE_VISITED_PARAM_NAME, this.cleanupLastVisitedPageURL(document.location.href))
  }

  public redirectToLastVisitedPage() {
        document.location.href = "" + sessionStorage.getItem(LAST_PAGE_VISITED_PARAM_NAME)
  }

  private cleanupLastVisitedPageURL(url:string) : string {
        return url.split('#')[0]
  }
}
