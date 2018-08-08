import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { user_password_forgot_api_url } from '../app/Shared/_services/api/api.url';
import { Message } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { AccountApiService } from '../app/Shared/_services/api/account.api.service';
@Component({
    moduleId: module.id,
    templateUrl: './forgotpassword.component.html'
})
export class ForgotPasswordComponent implements OnInit {

    form: FormGroup;
    msgs: Message[] = [];
    constructor(private userService: AccountApiService, private fb: FormBuilder, private messageService: MessageService) { }

    ngOnInit() {
        this.CreateForm();
    }
    OnSubmit(form) {
        const email = form.Email;
        this.userService.userForgotPassword(user_password_forgot_api_url, email).subscribe(res => {

            const data = JSON.parse(res);
            if (data.Data === '200') {
                this.messageService.add({ severity: 'success', summary: 'Submitted', detail: 'password sent to your mail' });
            } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Email ID' });
            }
        });
    }
    CreateForm() {
        this.form = this.fb.group({
            Email: ['', Validators.required]
        });
    }
}
