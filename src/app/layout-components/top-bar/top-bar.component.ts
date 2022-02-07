import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalizationService } from 'src/app/w3poc-core/localization.service';

@Component({
  selector: '[app-top-bar]',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  pagePath : string = ""

  constructor(
      public localization: LocalizationService
  ) { 
      this.pagePath = location.pathname.replace('/', '')
      if (this.pagePath == null || this.pagePath == undefined || this.pagePath == "") {
        this.pagePath = "mainPage"
      }
  }

  ngOnInit(): void {
  }

}
