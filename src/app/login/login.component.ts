import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';


/** Error when invalid control is dirty, touched, or submitted. */
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

  matcher = new MyErrorStateMatcher();

  hide = true;

  get RuEmail() { return this.loginFormGroup.get('RUmail'); }
  clearRuEmail() { this.loginFormGroup.controls['RUmail'].setValue(''); }

  get RuPassword() { return this.loginFormGroup.get('password'); }
  clearRuPassword() { this.loginFormGroup.controls['password'].setValue(''); }

  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {

    console.log(this.loginFormGroup.controls['RUmail']);

    console.log(this.loginFormGroup.controls['password']);


  }



}
