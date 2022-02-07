import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from './config-service.service';
import { LoginService } from './login-service.service';
import { LoginHandlerComponent } from './login-handler/login-handler.component';
import { LocalizationService } from './localization.service';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { LoadingModalService } from './loading-modal.service';
import { LoadingModalComponent } from './loading-modal/loading-modal.component';



@NgModule({
  declarations: [
    LoginHandlerComponent,
    LanguageSelectorComponent,
    LoadingModalComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    BrowserAnimationsModule
  ],
  providers: [
    ConfigService,
    LoginService,
    LocalizationService,
    LoadingModalService
  ],
  exports: [
    LoginHandlerComponent,
    LanguageSelectorComponent,
    LoadingModalComponent
  ]
})
export class W3pocCoreModule { }
