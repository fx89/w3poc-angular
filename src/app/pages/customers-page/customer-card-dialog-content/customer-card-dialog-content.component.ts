import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalizationService } from 'src/app/w3poc-core/localization.service';
import { W3pocDataService } from 'src/app/w3poc-http-data/w3poc-data.service';
import { CustomerHandsetsDialogContentComponent } from '../customer-handsets-dialog-content/customer-handsets-dialog-content.component';

@Component({
  selector: 'customer-card-dialog-content',
  templateUrl: './customer-card-dialog-content.component.html',
  styleUrls: ['./customer-card-dialog-content.component.css']
})
export class CustomerCardDialogContentComponent implements OnInit {

  customer : any
  customerTypesMap : []

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      public localization:LocalizationService,
      private dialog: MatDialog,
      private dataService : W3pocDataService
  ) {
      this.customer = data.customer
      this.customerTypesMap = data.customerTypesMap
  }

  ngOnInit(): void {
      console.log(this.customer)
  }

  onViewHandsetsButtonClick() {
    this.dataService.handsetRepository.findAllByCustomerId(this.customer.id)
      .subscribe(ret => {
          const dialogRef = this.dialog.open(CustomerHandsetsDialogContentComponent, {data: { handsets:ret.response } });
      })
  }

}
