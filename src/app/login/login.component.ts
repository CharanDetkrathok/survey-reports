import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { CookieService } from 'ngx-cookie-service';


/** Error ตรวจสอบการกรองข้อมูล email - password ว่าถูกต้องหรือไม่ */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFormGroup = this.formBuilder.group({
    RUmail: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  //-- สร้าง Object เพื่อไว้สำหรับตรวจสอบการกรอก email - password
  matcher = new MyErrorStateMatcher();

  _password_hide: boolean = true;
  _remenber_me: boolean = false;

  get RuEmail() { return this.loginFormGroup.get('RUmail'); }
  clearRuEmail() { this.loginFormGroup.controls['RUmail'].setValue(''); }

  get RuPassword() { return this.loginFormGroup.get('password'); }
  clearRuPassword() { this.loginFormGroup.controls['password'].setValue(''); }

  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router,
    private cookieService: CookieService
  ) {

    if (this.cookieService.check('_ru_mail') && this.cookieService.check('_ru_password') && this.cookieService.check('_remenber_me')) {
      this.loginFormGroup.controls['RUmail'].patchValue(this.cookieService.get('_ru_mail'));
      this.loginFormGroup.controls['password'].patchValue(this.cookieService.get('_ru_password'));
      this._remenber_me = true;
    }

  }

  ngOnInit(): void {

    console.log(this.cookieService.get('_ru_mail'));
    console.log(this.cookieService.get('_ru_password'));
    console.log(this.cookieService.get('_remenber_me'));

  }

  onSubmit() {

    if (this._remenber_me) {
      this.cookieService.set('_ru_mail', this.loginFormGroup.get('RUmail').value);
      this.cookieService.set('_ru_password', this.loginFormGroup.get('password').value);
      this.cookieService.set('_remenber_me', this._remenber_me.toString());
    } else {
      this.cookieService.delete('_ru_mail');
      this.cookieService.delete('_ru_password');
      this.cookieService.delete('_remenber_me');
    }

  }



}
