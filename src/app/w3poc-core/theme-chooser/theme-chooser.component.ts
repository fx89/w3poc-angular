import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config-service.service';

@Component({
  selector: 'theme-chooser',
  templateUrl: './theme-chooser.component.html',
  styleUrls: ['./theme-chooser.component.css']
})
export class ThemeChooserComponent implements OnInit {

  availableThemeNames : string[]
  selectedThemeName : string = localStorage.getItem("selectedThemeName")

  constructor(
      private config : ConfigService
  ) {
      // Get the available theme names from the config service
      this.availableThemeNames = config.getAttributeValue("availableThemeNames").split(",")

      // If this is the first time the application runs, there will
      // be no theme selected, in which case the default must be set
      if (this.selectedThemeName == null || this.selectedThemeName == undefined || this.selectedThemeName == "null" || this.selectedThemeName == "undefined") {
          this.selectedThemeName = this.availableThemeNames[0]
      }

      this.applySelectedThemeName()
  }

  ngOnInit(): void {
  }

  applySelectedThemeName() {
      // Save the setting to local storage
      localStorage.setItem("selectedThemeName", this.selectedThemeName)

      // Aply the setting to the DOM

      // First remove any previous settings
      for(let theme of this.availableThemeNames) {
          document.body.classList.remove('color-theme-' + theme)
      }

      // Then apply the current setting
      document.body.classList.add('color-theme-' + this.selectedThemeName)
  }
}
