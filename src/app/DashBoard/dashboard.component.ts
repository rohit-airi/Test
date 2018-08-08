import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import 'rxjs/add/operator/map';
import { dashboard_all_users_api_url, log_comment_list_api_url } from '../Shared/_services/api/api.url';
import { DashBoardApiService } from '../Shared/_services/api/dashboard.api.service';
import { LogApiService } from '../Shared/_services/api/log.api.service';
import { LoginModel } from '../Shared/_models/loginModel';
@Component({
    selector: 'app-page-title',
    templateUrl: './dashboard.component.html',
    styleUrls: ['../../assets/themes/css/plugins/morris.css']
})
export class DashBoardComponent implements OnInit {
    @Output() pageTitle: EventEmitter<string> = new EventEmitter<string>();
    message: string;
    userList: any[];
    logList: any[];
    loadingUser: boolean;
    loadingLog: boolean;
    userInfoModel:any;
    count: any;
    userInfo:LoginModel;
    constructor(private _dashboardApi: DashBoardApiService, private logService: LogApiService) {
      this.userInfo=JSON.parse(localStorage.getItem('auth_token'));
    }
    ngOnInit() {
        this.loadingUser = true;
        this.loadingLog = true;
        this.loadDashboardData();
    }
    loadDashboardData() {
      this._dashboardApi.getUsers(dashboard_all_users_api_url).subscribe(res => {
        this.loadingUser = false;
        if(res.StatusCode===200) {
          this.userList = res.Data;
          this.count = this.userList.length;
        }
    },error2 => {
        this.loadingUser = false;
      });
      const merchantModel = {'MerchantId': this.userInfo.MerchantId};
      this.logService.logCommentListApi(log_comment_list_api_url,merchantModel).subscribe(res => {
        this.loadingLog = false;
        if(res.StatusCode===200) {
          this.logList = res.Data;
          this.logList = this.logList.slice(0, 5).reverse();
        }
      },
      error2 => {
        this.loadingLog = false;
      });
    }
}
