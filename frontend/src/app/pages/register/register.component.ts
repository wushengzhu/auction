import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuctionService } from 'src/app/services/auction.service';
import { UserEditComponent } from 'src/app/shared/components/user-edit/user-edit.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  @ViewChild(UserEditComponent) userEditCpt: UserEditComponent;
  constructor(
    private fb: FormBuilder,
    private auctionSvc: AuctionService,
    private nzMsgSvc: NzMessageService
  ) {}

  ngOnInit() {}

  save() {
    this.userEditCpt.save();
  }

  cancel() {
    this.userEditCpt.cancel();
  }
}
