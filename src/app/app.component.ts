import { NotificationService } from './Shared/_services/notification.service';
import { Component, OnInit } from '@angular/core';
import { CommonService } from './Shared/_services/common.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers:[NotificationService]
})
export class AppComponent implements OnInit {
  title = 'app';
  currentUser: any;
  message: string;
  permissionList: any[];
  create: string;
  delete: string;
  view: string;
  update: string;
  constructor(private notificationService: NotificationService,public commonservice: CommonService) {
  }
  ngOnInit() {
    // const user = JSON.parse(localStorage.getItem('currentUser'));
    // this.currentUser = JSON.parse(user);

    // this.permissionList = this.currentUser.Data.PermissionList;

    // for (let i = 0; i < this.permissionList.length; i++) {
    //   if (this.permissionList[i].PermissionType === 'Create') {
    //     this.create = 'Create';
    //   }
    //   if (this.permissionList[i].PermissionType === 'Update') {
    //     this.update = 'Update';
    //   }
    //   if (this.permissionList[i].PermissionType === 'Delete') {
    //     this.delete = 'Delete';
    //   }
    //   if (this.permissionList[i].PermissionType === 'View') {
    //     this.view = 'View';
    //   }
    // }
  }
  get Notifications() {
    return this.notificationService.messages;
  }
}
