import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Message } from 'primeng/primeng';

@Component({
    moduleId: module.id,
    templateUrl: './newpassword.component.html'
})

export class NewPasswordComponent implements OnInit {
    form: FormGroup;
    msgs: Message[] = [];
    constructor(private fb: FormBuilder) { }
    ngOnInit() {

        this.CreateForm();
    }
    CreateForm() {
        this.form = this.fb.group({
            Email: ['', Validators.required]
        });
    }
    OnSubmit() {
    }
}
