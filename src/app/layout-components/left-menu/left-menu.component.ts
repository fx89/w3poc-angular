import { Component, OnInit } from '@angular/core';
import { LocalizationService } from 'src/app/w3poc-core/localization.service';

const LEFT_MENU_TOGGLE_KEY : string = "left-menu-toggle"

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent implements OnInit {

  constructor(
      public localization : LocalizationService
  ) { }

  ngOnInit(): void {
      let isToggled = sessionStorage.getItem(LEFT_MENU_TOGGLE_KEY)
      this.applyToggleState(isToggled)
  }

  public goToPage(page:string) {
      document.location.pathname = page
  }

  public isPageSelected(page:string) : boolean {
      return document.location.pathname.replace('/', '') == page
  }

  public toggleMenu() {
      let isToggled = sessionStorage.getItem(LEFT_MENU_TOGGLE_KEY)
      isToggled = isToggled == "yes" ? "no" : "yes"
      sessionStorage.setItem(LEFT_MENU_TOGGLE_KEY, isToggled)

      this.applyToggleState(isToggled)
  }

  private applyToggleState(isToggled:string) {
      const leftMenuElem = document.getElementsByClassName("left-menu").item(0)
      const contentElem = document.getElementsByClassName("app-content").item(0)

      leftMenuElem.classList.remove("closed")
      contentElem.classList.remove("closed-menu")

      if (isToggled == "yes") {
          leftMenuElem.classList.add("closed")
          contentElem.classList.add("closed-menu")
      } else {
          leftMenuElem.classList.remove("closed")
          contentElem.classList.remove("closed-menu")
      }
  }
}
