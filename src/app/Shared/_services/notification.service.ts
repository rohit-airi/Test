import {Message} from 'primeng/primeng';
import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {
  public messages: Message[];

  constructor() {
    this.messages = [];
  }

  public showInfo(caption: string, text = '', secondsUntilClear = 3) {
    const item = {severity: 'info', summary: caption, detail: text};
    this.messages.push(item);
    this.setClearTimer(item, secondsUntilClear);
  }

  public showError(caption: string, text = '', secondsUntilClear = 0) {
    const item = {severity: 'error', summary: caption, detail: text};
    this.messages.push(item);
    this.setClearTimer(item, secondsUntilClear);
  }

  public showWarn(caption: string, text = '', secondsUntilClear = 3) {
    const item = {severity: 'warn', summary: caption, detail: text};
    this.messages.push(item);
    this.setClearTimer(item, secondsUntilClear);
  }

  public showSuccess(caption: string, text = '', secondsUntilClear = 3) {
    const item = {severity: 'success', summary: caption, detail: text};
    this.messages.push(item);
    this.setClearTimer(item, secondsUntilClear);
  }

  private setClearTimer(item: any, period: number) {
    if (isNaN(period) || period <= 0) {
      return;
    }
    setTimeout(() => {
      const index = this.messages.indexOf(item);
      if (index > -1) {
        this.messages.splice(index, 1);
      }
    }, period * 1000);
  }
}
