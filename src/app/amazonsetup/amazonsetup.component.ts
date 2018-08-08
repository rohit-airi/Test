import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
import { MenuItem, Message } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { amazon_ValidateSetupAccount } from '../Shared/_services/api/api.url';
import { AmazonApiService } from '../Shared/_services/api/amazon.api.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { LoginModel } from '../Shared/_models/loginModel';
import * as $ from 'jquery';
@Component({
  selector: 'app-amazonsetup',
  templateUrl: './amazonsetup.component.html',
  styleUrls: ['./amazonsetup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AmazonsetupComponent implements OnInit {
  @Input() newmerchant: boolean;
  @Output() messageEvent = new EventEmitter<string>();
  loading:boolean;
  items: MenuItem[];
  activeIndex: number;
  msgs: Message[] = [];
  firstWZD: boolean;
  secondWZD: boolean;
  thirldWZD: boolean;
  sellerId: string;
  AuthToken: string;
  merchantName: string;
  amazonSetupForm: FormGroup;
  userInfo:LoginModel;
  index: number;
  constructor(private amazonServices: AmazonApiService, private _fb: FormBuilder,
  private messageService: MessageService) {
    this.activeIndex = 1;
    this.firstWZD = true;
    this.secondWZD = false;
    this.thirldWZD = false;
    this.sellerId = '';
    this.AuthToken = '';
    this.merchantName = '';
    this.index=0;
    this.userInfo=JSON.parse(localStorage.getItem('auth_token'));
  }
      scrollToTop() { (function smoothscroll() {
        const currentScroll = document.documentElement.scrollTop ||
        document.body.scrollTop; if (currentScroll > 0) {
            window.requestAnimationFrame(smoothscroll);
            window.scrollTo(0, currentScroll - (currentScroll / 5));
        }
    })();
}

  openNext() {
      this.index =  this.index + 1;
  }

  openPrev() {
      this.index = (this.index === 0) ? 2 : this.index - 1;
  }
  onTabChange(event) {
    this.index =event.index;
  }
  ngOnInit() {
    this.items = [
      { label: 'Step 1' },
      { label: 'Step 2' },
      { label: 'Step 3' }
    ];
    this.items = [{
      label: 'Personal',
      command: (event: any) => {
        this.activeIndex = 0;
        this.msgs.length = 0;
        this.msgs.push({ severity: 'info', summary: 'First Step', detail: event.item.label });
      }
    },
    {
      label: 'Seat',
      command: (event: any) => {
        this.activeIndex = 1;
        this.msgs.length = 0;
        this.msgs.push({ severity: 'info', summary: 'Seat Selection', detail: event.item.label });

      }
    },
    {
      label: 'Payment',
      command: (event: any) => {
        this.activeIndex = 2;
        this.msgs.length = 0;
        this.msgs.push({ severity: 'info', summary: 'Pay with CC', detail: event.item.label });
      }
    },
    {
      label: 'Confirmation',
      command: (event: any) => {
        this.activeIndex = 3;
        this.msgs.length = 0;
        this.msgs.push({ severity: 'info', summary: 'Last Step', detail: event.item.label });
      }
    }
    ];

    this.amazonSetupForm = this._fb.group({
      SellerId: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(15), Validators.required])],
      TokenId: ['', Validators.compose([Validators.minLength(20), Validators.maxLength(60), Validators.required])],
      MerchantName: ['', Validators.required]
    });
  }
  NextStep() {
    this.firstWZD = false;
    this.secondWZD = true;
    this.thirldWZD = false;
  }
  NextSteps() {
    this.firstWZD = false;
    this.secondWZD = false;
    this.thirldWZD = true;
  }
  step2() {
    this.firstWZD = false;
    this.secondWZD = true;
    this.thirldWZD = false;
  }
  finalStep(SetupValue) {
    window.scroll(0,0);
    this.loading=true;
    this.msgs=[];
    if (this.sellerId !== '' && this.AuthToken !== '') {
      const accountSetupModel = {'UserId':this.userInfo.UserId,'MerchantName': this.merchantName, 'SellerId': this.sellerId,
      'AuthTokenId': this.AuthToken,
      'ServiceUrl': '' };
      this.amazonServices.validateSignUpAccount(amazon_ValidateSetupAccount, accountSetupModel).subscribe(
        result => {
          this.loading=false;
          if (this.newmerchant) {
            this.messageEvent.emit(result);
          } else {
            if (result.StatusCode === 200) {

            } else if (result.StatusCode === 400) {
              this.msgs.push({ severity: 'warning', summary: 'warning', detail: result.Data });
            }
          }
        },
        error => {
        }
      );
    } else {
      this.loading=false;
      this.messageService.add({ severity: 'error', summary: 'error', detail: 'Some error found, Please contact your admin' });
    }
  }
  redirectToSeller() {
    window.open('https://sellercentral.amazon.com/');
  }
}
