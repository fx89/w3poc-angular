import { Component, OnInit } from '@angular/core';
import { LocalizationService } from '../localization.service';

@Component({
  selector: 'language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent implements OnInit {

  selection : string

  constructor(
      private localization : LocalizationService
  ) {
      this.selection = localization.getSelectedLanguage()
  }

  ngOnInit(): void {
  }

  public getAvailableLanguages() : string[] {
      return this.localization.getLanguages()
  }

  public onLanguageSelectionChanged(event:any) {
      this.localization.selectLanguage(event.value)
  }
}
