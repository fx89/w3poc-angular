import { Component, OnInit } from '@angular/core';
import { LocalizationService } from 'src/app/w3poc-core/localization.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(
      public localization : LocalizationService
  ) { }

  ngOnInit(): void {
  }

}
