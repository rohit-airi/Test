import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RootRoutingModule } from './root-routing.module';
import { RootComponent } from './root.component';
import { HttpModule } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserApiService } from './app/Shared/_services/api/user.api.service';
import { CookieService } from 'ngx-cookie-service';
import { TokenService } from 'angular2-auth';
import { AuthService } from './app/Shared/_services/auth.service';
import { Configuration } from './app/app.configuration';
@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        RootRoutingModule
    ],
    declarations: [
        RootComponent

    ],
    providers: [CookieService,{provide: LocationStrategy, useClass: HashLocationStrategy},TokenService,AuthService,
      UserApiService,Configuration],
    bootstrap: [RootComponent]
})
export class RootModule {

}
