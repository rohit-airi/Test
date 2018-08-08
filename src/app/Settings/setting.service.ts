import { Injectable } from '@angular/core';

@Injectable()
export class SettingService {
  public selectedRegion:string;
  constructor() {}
  public setRegion(currectRegion: string) {
    this.selectedRegion=currectRegion;
  }
  public getRegion() {
    return this.selectedRegion;
  }
}
