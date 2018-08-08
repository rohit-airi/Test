import { Injectable } from '@angular/core';
@Injectable()
export class Configuration {
  // public appUrl= 'https://amazon-mws-web-v1.azurewebsites.net/';
  public appUrl= 'http://localhost:4200/';

  public Server='http://localhost:62462/';
  // public Server = 'https://amazon-web-api-v1.azurewebsites.net/';
  // public Server='https://amazon-web-api-development.azurewebsites.net/';

  public ApiUrl = 'api/';

  public ServerWithApiUrl = this.Server + this.ApiUrl;

  public AmazonAdvBaseUrl = this.appUrl+'#/app/settings/amazondata';

  public AmzonDataJs = this.appUrl+'assets/custom/amazon_data.js';
}
