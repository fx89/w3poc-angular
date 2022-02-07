import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { LoadingModalService } from '../loading-modal.service';

@Component({
  selector: 'loading-modal',
  templateUrl: './loading-modal.component.html',
  styleUrls: ['./loading-modal.component.css']
})
export class LoadingModalComponent {

  @Input()
  id : string = "_loading_modal";

  @Input()
  stateEvent : EventEmitter<boolean> = new EventEmitter<boolean>();

  private modalCoverElement : HTMLElement | any;

  private modalFormElement : HTMLElement | any;

  public svc : LoadingModalService;

  constructor(svc : LoadingModalService) { 
    this.svc = svc;
  }

  ngAfterViewInit() {
    this.modalCoverElement = document.getElementById(this.getModalCoverId());
    this.modalFormElement = document.getElementById(this.getCenterFormId());

    this.stateEvent.subscribe((isVisible) => {
      this.handleShowHide(isVisible);
    });

    this.svc.stateEvent.subscribe((isVisible) => {
      this.handleShowHide(isVisible);
    });
  }

  getModalCoverId() : string {
    return this.id + "_modal_cover";
  }

  getCenterFormId() : string {
    return this.id + "_center_form";
  }

  private handleShowHide(isVisible : boolean) {

    if (this.modalCoverElement) {
      this.modalCoverElement.style.visibility = isVisible ? "visible" : "hidden";
      this.svc.status = isVisible;
    }

    if (this.modalFormElement) {
      this.modalFormElement.style.visibility = isVisible ? "visible" : "hidden";
      this.svc.status = isVisible;
    }

    this.modalCoverElement.classList.remove('hidden');
    this.modalFormElement.classList.remove('hidden');

    if (!isVisible) {
        this.modalCoverElement.classList.add('hidden');
        this.modalFormElement.classList.add('hidden');
    }
  }

}


