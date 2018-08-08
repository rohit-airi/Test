import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AmazonsetupComponent } from './amazonsetup.component';
import { LoadingModule } from 'ngx-loading';
import {APP_BASE_HREF} from '@angular/common';
import {TabViewModule,GrowlModule} from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AmazonApiService } from '../Shared/_services/api/amazon.api.service';
describe('AmazonsetupComponent', () => {
  let component: AmazonsetupComponent;
  let fixture: ComponentFixture<AmazonsetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // declarations:[AmazonsetupComponent],
      imports:[LoadingModule, TabViewModule, FormsModule,ReactiveFormsModule,GrowlModule],
      providers:[AmazonApiService,{provide: APP_BASE_HREF, useValue: '/'}]
    });
    // .compileComponents();
    fixture = TestBed.createComponent(AmazonsetupComponent);
    component = fixture.componentInstance;
  }));

  // beforeEach(() => {
    // fixture = TestBed.createComponent(AmazonsetupComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  // });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
