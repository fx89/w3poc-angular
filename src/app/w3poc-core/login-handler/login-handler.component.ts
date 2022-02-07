import { Component, OnInit } from '@angular/core';
import { ID_TOKEN_PARAM_NAME, LoginService } from '../login-service.service';

@Component({
  selector: 'login-handler',
  templateUrl: './login-handler.component.html',
  styleUrls: ['./login-handler.component.css']
})
export class LoginHandlerComponent implements OnInit {

  constructor(
      private loginService : LoginService
  ) { }

  ngOnInit(): void {
      if (this.loginService.isNotLoggedIn()) {
            if (this.tryResolvingIdTokenFromUrl()) {
                this.loginService.redirectToLastVisitedPage()
            } else {
                this.loginService.redirectToLoginForm()
            }
      }
  }

  private tryResolvingIdTokenFromUrl() : boolean {
      const idToken = this.getIdTokenFromUrl()

      if (this.loginService.validateIdToken(idToken)) {
          this.loginService.setIdToken(idToken)
          return true
      }

      return false
  }

  private getIdTokenFromUrl() : string | null {
      const urlParams = new URL(window.location.href.replace('#', '?')).searchParams
      return  urlParams.get(ID_TOKEN_PARAM_NAME)
  }
}
