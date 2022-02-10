import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocalizationService } from 'src/app/w3poc-core/localization.service';
import { W3pocDataService } from 'src/app/w3poc-http-data/w3poc-data.service';
import { CustomerCardDialogContentComponent } from './customer-card-dialog-content/customer-card-dialog-content.component';

@Component({
  selector: 'app-customers-page',
  templateUrl: './customers-page.component.html',
  styleUrls: ['./customers-page.component.css']
})
export class CustomersPageComponent implements OnInit {

  private CUSTOMER_TYPE_ALL : any = { id:-1, name:"" }

  customerTypesMap : any = []
  customerTypes : any[]
  selectedCustomerType : any = this.CUSTOMER_TYPE_ALL

  customers : any[]
  customersTableColumns : string[] = [
      "name",
      "type",
      "address",
      "phoneNumber",
      "emailAddress"
    ]

  namePattern : string = ''

  windowStart : number = 0
  windowSize : number = 10

  constructor(
      private dataService : W3pocDataService,
      public localization : LocalizationService,
      private dialog: MatDialog
  ) { }

  ngOnInit(): void {

      this.loadCustomerTypes()
      this.findCustomers()
  }

  private loadCustomerTypes() {
      this.CUSTOMER_TYPE_ALL.name = this.localization.getMessage("all")

      this.dataService.customerTypeRepository.findAll()
          .subscribe(ret => {
              this.customerTypes = ret.response

              this.customerTypes.push(this.CUSTOMER_TYPE_ALL)

              for (let cType of ret.response) {
                  this.customerTypesMap[cType.id] = cType.name
              }
          })
  }

  private findCustomers() {
      const requestObserver
          = this.selectedCustomerType == this.CUSTOMER_TYPE_ALL
                ? this.dataService.customerRepository.pageAllByNameLike(this.namePattern, this.windowStart, this.windowSize)
                : this.dataService.customerRepository.pageAllByTypeIdAndNameLike(this.selectedCustomerType.id, this.namePattern, this.windowStart, this.windowSize)

      requestObserver
          .subscribe(ret => {
              this.customers = ret.response
            })
  }

  onFiltersChanged() {
      this.resetWindow()
      this.findCustomers()
  }

  isPrevPageButtonDisabled() {
      return this.windowStart == 0
  }

  isNextPageButtonDisabled() {
      return this.customers?.length < this.windowSize
  }

  goToNextPage() {
      if (!this.isNextPageButtonDisabled()) {
          this.windowStart += this.windowSize
          this.findCustomers()
      }
  }

  goToPrevPage() {
      if (!this.isPrevPageButtonDisabled()) {
          this.windowStart -= this.windowSize
          this.findCustomers()
      }
  }

  private resetWindow() {
      this.windowStart = 0
  }

  openCustomerCardDialog(customer:any) {
      const dialogRef = this.dialog.open(CustomerCardDialogContentComponent, {data: { customer:customer, customerTypesMap:this.customerTypesMap } });

      dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
      });
  }
}
