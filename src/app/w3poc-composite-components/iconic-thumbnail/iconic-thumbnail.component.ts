import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'iconic-thumbnail',
  templateUrl: './iconic-thumbnail.component.html',
  styleUrls: ['./iconic-thumbnail.component.css']
})
export class IconicThumbnailComponent implements OnInit {

  @Input()
  value : string = ""

  @Input()
  iconName : string = ""

  @Input()
  selected : boolean = false

  constructor() { }

  ngOnInit(): void {
  }

}
