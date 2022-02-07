import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconicThumbnailComponent } from './iconic-thumbnail/iconic-thumbnail.component';
import { ThreeDotsLoadingComponent } from './three-dots-loading/three-dots-loading.component';



@NgModule({
  declarations: [
    IconicThumbnailComponent,
    ThreeDotsLoadingComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IconicThumbnailComponent,
    ThreeDotsLoadingComponent
  ]
})
export class W3pocCompositeComponentsModule { }
