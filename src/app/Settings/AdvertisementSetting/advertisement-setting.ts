import { async } from '@angular/core/testing';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { get_Merchant_For_Adv } from '../../Shared/_services/api/api.url';
import { AdvMerchantInfo } from '../../Shared/_models/advMerchantInfo';
import { AmazonApiService } from '../../Shared/_services/api/amazon.api.service';
import { Configuration } from '../../app.configuration';
import { ConfirmationService } from 'primeng/primeng';
import { NotificationService } from '../../Shared/_services/notification.service';
import { SettingService } from '../setting.service';
declare var open: Function;
@Component({
  templateUrl: './advertisement-setting.html'
})
export class AdvertisementSettingComponent implements OnInit, AfterViewInit {
  selectedRegion: string;
  system: any;
  advMerchantList: AdvMerchantInfo[];
  advMerchantLoader: boolean;
  advBaseUrl: string;
  constructor(private _settingServices:SettingService,private _notification: NotificationService,
    private _confirmServise: ConfirmationService, private _configuration: Configuration,private _amazonService: AmazonApiService) {
    this.selectedRegion = 'NA';
    this.advMerchantList = [];
    this.advMerchantLoader = true;
    this.advBaseUrl = this._configuration.AmazonAdvBaseUrl;
  }
  ngOnInit() {
    this.getAdvMerchantList();
    this._settingServices.setRegion(this.selectedRegion);
  }
  getAdvMerchantList() {
    this._amazonService.getAllmerchantForAdv(get_Merchant_For_Adv).subscribe(
      result => {
        this.advMerchantLoader = false;
        if (result.StatusCode === 200) {
          this.advMerchantList = result.Data;
        }
      },
      error => {
        this.advMerchantLoader = false;
      }
    );
  }
  async ngAfterViewInit() {
    await this.loadScript(this._configuration.AmzonDataJs);
  }
  private loadScript(scriptUrl: string) {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = scriptUrl;
      scriptElement.onload = resolve;
      document.body.appendChild(scriptElement);
    });
  }
  selectRegion() {
    this._settingServices.setRegion(this.selectedRegion);
  }
  resetAdv(currentAdvertisement) {
    this._confirmServise.confirm({
      message: 'Are you sure to reset this Merchant?',
      accept: () => {
        this.advMerchantLoader = true;
        const advMerchantModel = { MerchantId: currentAdvertisement.MerchantId };
        this._amazonService.resetAdvertisement(advMerchantModel).subscribe(
          result => {
            this.advMerchantLoader = false;
            if (result.StatusCode === 200) {
              this._notification.showSuccess('Success', 'Advertisement Info reset');
            } else {
              this._notification.showWarn('Warn', 'Something went wrong, Please contact your admin');
            }
          },
          error => {
            this.advMerchantLoader = false;
            this._notification.showError('Error', 'Something went wrong, Please contact your admin');
          }
        );
      },
      reject: () => {
        this.getAdvMerchantList();
      }
    });
  }
}
