import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  inventory_setting_api_url,
  inventory_setting_detail_api_url
} from '../../Shared/_services/api/api.url';
import { InventoryApiService } from '../../Shared/_services/api/inventory.api.service';
import { NotificationService } from '../../Shared/_services/notification.service';
@Component({
  templateUrl: './inventory-setting.component.html'
})
export class InventorySettingComponent implements OnInit {
  public form1: FormGroup;
  public form2: FormGroup;
  public form3: FormGroup;
  public form4: FormGroup;
  public form5: FormGroup;
  public form6: FormGroup;
  afnfulfillablequantity: string;
  afnunsellablequantity: string;
  afnreservedquantity: string;
  afninboundworkingquantity: string;
  afninboundshippedquantity: string;
  afninboundreceivingquantity: string;

  displaySelectedValues1: string;
  availableSelectedValues2: string;
  partialSelectedValues3: string;
  displaySelectedValues4: string;
  availableSelectedValues5: string;
  partialSelectedValues6: string;
  displaySelectedValues7: string;
  availableSelectedValues8: string;
  partialSelectedValues9: string;
  displaySelectedValues10: string;
  availableSelectedValues11: string;
  partialSelectedValues12: string;
  displaySelectedValues13: string;
  availableSelectedValues14: string;
  partialSelectedValues15: string;
  displaySelectedValues16: string;
  availableSelectedValues17: string;
  partialSelectedValues18: string;

  obj: any = {
    form1: '',
    form2: '',
    form3: '',
    form4: '',
    form5: '',
    form6: ''
  };

  constructor(
    private frmbuilder: FormBuilder,
    private _inventoryService: InventoryApiService,
    private _notification: NotificationService
  ) {
    this.afnfulfillablequantity = 'afn-fulfillable-quantity';
    this.afnunsellablequantity = 'afn-unsellable-quantity';
    this.afnreservedquantity = 'afn-reserved-quantity';
    this.afninboundworkingquantity = 'afn-inbound-working-quantity';
    this.afninboundshippedquantity = 'afn-inbound-shipped-quantity';
    this.afninboundreceivingquantity = 'afn-inbound-receiving-quantity';
  }
  ngOnInit() {
    this.LoadSetting();
    this.displaySelectedValues1 = 'No';
    this.availableSelectedValues2 = 'No';
    this.partialSelectedValues3 = '0';
    this.displaySelectedValues4 = 'No';
    this.availableSelectedValues5 = 'No';
    this.partialSelectedValues6 = '0';
    this.displaySelectedValues7 = 'No';
    this.availableSelectedValues8 = 'No';
    this.partialSelectedValues9 = '0';
    this.displaySelectedValues10 = 'No';
    this.availableSelectedValues11 = 'No';
    this.partialSelectedValues12 = '0';
    this.displaySelectedValues13 = 'No';
    this.availableSelectedValues14 = 'No';
    this.partialSelectedValues15 = '0';
    this.displaySelectedValues16 = 'No';
    this.availableSelectedValues17 = 'No';
    this.partialSelectedValues18 = '0';

    this.form1 = this.frmbuilder.group({
      InventoryType: ['AfnFulfillableQuantity'],
      Display: [''],
      Available: [''],
      Partial: ['', Validators.pattern('^[0-9]+$')]
    });
    this.form2 = this.frmbuilder.group({
      InventoryType: ['AfnUnsellableQty'],
      Display: [''],
      Available: [''],
      Partial: ['', Validators.pattern('^[0-9]+$')]
    });
    this.form3 = this.frmbuilder.group({
      InventoryType: ['AfnReservedQty'],
      Display: [''],
      Available: [''],
      Partial: ['', Validators.pattern('^[0-9]+$')]
    });
    this.form4 = this.frmbuilder.group({
      InventoryType: ['AfnInboundWorkingQty'],
      Display: [''],
      Available: [''],
      Partial: ['', Validators.pattern('^[0-9]+$')]
    });
    this.form5 = this.frmbuilder.group({
      InventoryType: ['AfnInboundShipQty'],
      Display: [''],
      Available: [''],
      Partial: ['', Validators.pattern('^[0-9]+$')]
    });
    this.form6 = this.frmbuilder.group({
      InventoryType: ['AfninboundreceivedQty'],
      Display: [''],
      Available: [''],
      Partial: ['', Validators.pattern('^[0-9]+$')]
    });
  }
  NonAvail(event) {
    if (event === 'form1') {
      this.form1.patchValue({ Partial: '0' });
      this.form1.get('Partial').markAsPristine();
      const ctrl = this.form1.get('Partial');
      ctrl.disable();
    }
    if (event === 'form2') {
      this.form2.patchValue({ Partial: '0' });
      this.form2.get('Partial').markAsPristine();
      const ctrl = this.form2.get('Partial');
      ctrl.disable();
    }
    if (event === 'form3') {
      this.form3.patchValue({ Partial: '0' });
      this.form3.get('Partial').markAsPristine();
      const ctrl = this.form3.get('Partial');
      ctrl.disable();
    }
    if (event === 'form4') {
      this.form4.patchValue({ Partial: '0' });
      this.form4.get('Partial').markAsPristine();
      const ctrl = this.form4.get('Partial');
      ctrl.disable();
    }
    if (event === 'form5') {
      this.form5.patchValue({ Partial: '0' });
      this.form5.get('Partial').markAsPristine();
      const ctrl = this.form5.get('Partial');
      ctrl.disable();
    }
    if (event === 'form6') {
      this.form6.patchValue({ Partial: '0' });
      this.form6.get('Partial').markAsPristine();
      const ctrl = this.form6.get('Partial');
      ctrl.disable();
    }
  }

  Avail(event) {
    if (event === 'form1') {
      const ctrl = this.form1.get('Partial');
      ctrl.enable();
    }
    if (event === 'form2') {
      const ctrl = this.form2.get('Partial');
      ctrl.enable();
    }
    if (event === 'form3') {
      const ctrl = this.form3.get('Partial');
      ctrl.enable();
    }
    if (event === 'form4') {
      const ctrl = this.form4.get('Partial');
      ctrl.enable();
    }
    if (event === 'form5') {
      const ctrl = this.form5.get('Partial');
      ctrl.enable();
    }
    if (event === 'form6') {
      const ctrl = this.form6.get('Partial');
      ctrl.enable();
    }
  }

  OnSubmit(form1, form2, form3, form4, form5, form6) {
    this.obj.form1 = form1;
    this.obj.form2 = form2;
    this.obj.form3 = form3;
    this.obj.form4 = form4;
    this.obj.form5 = form5;
    this.obj.form6 = form6;

    this._inventoryService
      .InventorySettingAddApi(inventory_setting_api_url, this.obj)
      .subscribe(res => {
        if (res.StatusCode === 200) {
          this._notification.showSuccess('success','Setting Submitted Successfully');
          this.LoadSetting();
        } else {
          this._notification.showError('error','Failed to submit');
        }
      });
  }

  LoadSetting() {
    this._inventoryService
      .InventorySettingDetailAddApi(inventory_setting_detail_api_url)
      .subscribe(res => {
        if(res.Data.length>0) {
        this.displaySelectedValues1 = res.Data[0].Display;
        this.availableSelectedValues2 = res.Data[0].Available;
        this.partialSelectedValues3 = res.Data[0].Partial;
        this.displaySelectedValues4 = res.Data[1].Display;
        this.availableSelectedValues5 = res.Data[1].Available;
        this.partialSelectedValues6 = res.Data[1].Partial;
        this.displaySelectedValues7 = res.Data[2].Display;
        this.availableSelectedValues8 = res.Data[2].Available;
        this.partialSelectedValues9 = res.Data[2].Partial;
        this.displaySelectedValues10 = res.Data[3].Display;
        this.availableSelectedValues11 = res.Data[3].Available;
        this.partialSelectedValues12 = res.Data[3].Partial;
        this.displaySelectedValues13 = res.Data[4].Display;
        this.availableSelectedValues14 = res.Data[4].Available;
        this.partialSelectedValues15 = res.Data[4].Partial;
        this.displaySelectedValues16 = res.Data[5].Display;
        this.availableSelectedValues17 = res.Data[5].Available;
        this.partialSelectedValues18 = res.Data[5].Partial;
        }
        if (this.availableSelectedValues2 === 'No') {
          const ctrl = this.form1.get('Partial');
          ctrl.disable();
        }
        if (this.availableSelectedValues5 === 'No') {
          const ctrl = this.form2.get('Partial');
          ctrl.disable();
        }



        if (this.availableSelectedValues8 === 'No') {
          const ctrl = this.form3.get('Partial');
          ctrl.disable();
        }

        if (this.availableSelectedValues11 === 'No') {
          const ctrl = this.form4.get('Partial');
          ctrl.disable();
        }
        if (this.availableSelectedValues14 === 'No') {
          const ctrl = this.form5.get('Partial');
          ctrl.disable();
        }
        if (this.availableSelectedValues17 === 'No') {
          const ctrl = this.form6.get('Partial');
          ctrl.disable();
        }
      });
  }
}
