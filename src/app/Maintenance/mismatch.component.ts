import { Component, OnInit } from '@angular/core';
import {
    inventory_amazon_not_import_api_url, inventory_import_not_amazon_api_url
} from '../Shared/_services/api/api.url';
import { InventoryApiService } from '../Shared/_services/api/inventory.api.service';
@Component({
    templateUrl: './mismatch.component.html'
})

export class MismatchComponent implements OnInit {
    loading: boolean;
    ImportNotAmazon: any[];
    AmazonNotImport: any[];
    Header: any[];
    loading1: boolean;
    loading2: boolean;
    constructor(private inventoryService: InventoryApiService) {
      this.loading=true;
    }
    ngOnInit() {
        setTimeout(() => {
            this.loading1 = true;
            this.loading=false;
        this.inventoryService.ImportNotAmazonApi(inventory_import_not_amazon_api_url).subscribe(res => {
           this.ImportNotAmazon = res.Data;
           this.loading1 = false;
        });  },2000);



        setTimeout(() => {
            this.loading2 = true;
            this.loading=false;
        this.inventoryService.AmazonNotImportApi(inventory_amazon_not_import_api_url).subscribe(res => {
           this.AmazonNotImport = res.Data;
           this.loading2=false;
        },error=> {
        });
    },2000);
}}
