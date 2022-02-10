import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalizationService } from 'src/app/w3poc-core/localization.service';

@Component({
  selector: 'customer-handsets-dialog-content',
  templateUrl: './customer-handsets-dialog-content.component.html',
  styleUrls: ['./customer-handsets-dialog-content.component.css']
})
export class CustomerHandsetsDialogContentComponent implements OnInit {

  handsetsTableColumns : string[] = [
    "HO_INST_PROD_ID",
    "HO_PRODUCT_ID",
    "HO_PRODUCT_DESCR",
    "HO_PRODUCT_CATEGORY",
    "HO_ATTIV_SERV_DTTM",
    "HO_INST_PROD_STATUS",
    "HO_CAPTURE_ID"
  ]

  handsets : any[]

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      public localization : LocalizationService
  ) {
      this.handsets = data.handsets
  }

  ngOnInit(): void {
  }

}
