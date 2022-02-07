import { Component, OnInit } from '@angular/core';
import { LocalizationService } from 'src/app/w3poc-core/localization.service';

@Component({
  selector: 'app-loading-modal-content',
  templateUrl: './loading-modal-content.component.html',
  styleUrls: ['./loading-modal-content.component.css']
})
export class LoadingModalContentComponent implements OnInit {

  constructor(
      public localization : LocalizationService
  ) { }

  ngOnInit(): void {
  }

}
