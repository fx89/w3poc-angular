import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  public getAttributeValue(attributeName : string) : string {
    let confElmArray : any = document.getElementsByTagName("configuration");
    if (confElmArray) {
      let config : HTMLElement = confElmArray[0];
      if (config) {
        return <any>config.getAttribute(attributeName);
      }
    }
    throw "index.html is missing the <configuration> tag";
  }
}
