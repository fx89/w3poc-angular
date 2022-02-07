import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { W3pocCompositeComponentsModule } from './w3poc-composite-components/w3poc-composite-components.module';
import { W3pocCoreModule } from './w3poc-core/w3poc-core.module';
import { W3pocHttpDataModule } from './w3poc-http-data/w3poc-http-data.module';
import { W3pocServicesModule } from './w3poc-services/w3poc-services.module';
import { CustomersPageComponent } from './pages/customers-page/customers-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { LeftMenuComponent } from './layout-components/left-menu/left-menu.component';
import { TopBarComponent } from './layout-components/top-bar/top-bar.component';
import { LoadingModalContentComponent } from './layout-components/loading-modal-content/loading-modal-content.component';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    CustomersPageComponent,
    MainPageComponent,
    LeftMenuComponent,
    TopBarComponent,
    LoadingModalContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    W3pocCoreModule,
    W3pocHttpDataModule,
    W3pocServicesModule,
    W3pocCompositeComponentsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatExpansionModule,
    MatSelectModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
