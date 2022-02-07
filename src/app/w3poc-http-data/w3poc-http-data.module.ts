import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { W3pocCoreModule } from '../w3poc-core/w3poc-core.module';
import { W3pocDataService } from './w3poc-data.service';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    W3pocCoreModule,
    HttpClientModule
  ],
  providers: [
    W3pocDataService
  ]
})
export class W3pocHttpDataModule { }
