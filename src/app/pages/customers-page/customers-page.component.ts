import { Component, OnInit } from '@angular/core';
import { LocalizationService } from 'src/app/w3poc-core/localization.service';
import { W3pocDataService } from 'src/app/w3poc-http-data/w3poc-data.service';

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
  customersTableColumns : string[] = ["name", "type"]

  namePattern : string = ''

  windowStart : number = 0
  windowSize : number = 100

  constructor(
      private dataService : W3pocDataService,
      public localization : LocalizationService
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
              this.customers.push(this.CUSTOMER_TYPE_ALL)
            })
  }

  onFiltersChanged() {
      this.findCustomers()
  }
}
