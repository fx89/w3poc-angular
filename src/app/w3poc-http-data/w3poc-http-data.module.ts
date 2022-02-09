import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { W3pocCoreModule } from '../w3poc-core/w3poc-core.module';
import { W3pocDataService } from './w3poc-data.service';
import { HttpClientModule } from '@angular/common/http';
import { W3POCHttpClientDataProvider } from './w3poc-http-client-data-provider';
import { AwsLambdaW3pocClientDataProviderService } from './w3poc-client-data-providers/aws-lambda-w3poc-client-data-provider.service';
import { MockW3pocClientDataProviderService } from './w3poc-client-data-providers/mock-w3poc-client-data-provider.service';

/**
 * For production purposes, the AWS-LAMBDA data provider will be used
 */
const production = [
  { provide: W3POCHttpClientDataProvider, useClass: AwsLambdaW3pocClientDataProviderService }
];

/**
 * To save money while developing, the MOCK data provider will be used
 */
const mock = [
  { provide: W3POCHttpClientDataProvider, useClass: MockW3pocClientDataProviderService }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    W3pocCoreModule,
    HttpClientModule
  ],
  providers: [
    mock,
    W3pocDataService
  ]
})
export class W3pocHttpDataModule { }
