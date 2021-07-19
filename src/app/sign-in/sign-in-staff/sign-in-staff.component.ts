import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-in-staff',
  templateUrl: './sign-in-staff.component.html',
  styleUrls: ['./sign-in-staff.component.css']
})
export class SignInStaffComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onKeyUpRuMail(e) {

    const emailValue = e.target.value;

    // span tag สำหรับแสดงข้อความ error
    const sectionTagEmail = e.target.parentElement;
    const spanErrorMessage = sectionTagEmail.querySelector('span');

    if (emailValue === '') {

      // TODO : แสดง border error สีแดง 
      e.target.classList.value === 'input-ru-email' ? e.target.classList.replace('input-ru-email', 'input-error') : e.target.classList.add('input-error');


      // TODO : แสดงข้อความ error 
      spanErrorMessage.classList.value === 'error-message-ru-mail-hidden' ? spanErrorMessage.classList.replace('error-message-ru-mail-hidden', 'error-message-ru-mail') : spanErrorMessage.classList.add('error-message-ru-mail');

    } else if (e.target.value.substr(-9) === '@ru.ac.th') {

      // TODO : ยกเลิก แสดง border error สีแดง หรือสีเทา
      // * เปลี่ยน border เป็นสีเขียว
      e.target.classList.value === 'input-ru-email' ? e.target.classList.replace('input-ru-email','input-correct') : e.target.classList.replace('input-error','input-correct');

      // TODO : ยกเลิก แสดง span error  สีแดง
      spanErrorMessage.classList.value === 'error-message-ru-mail' ? spanErrorMessage.classList.replace('error-message-ru-mail', 'error-message-ru-mail-hidden') : spanErrorMessage.classList.add('error-message-ru-mail-hidden');

    } else {

      // TODO : ยกเลิก แสดง border error สีแดง
      e.target.classList.value === 'input-error' ? e.target.classList.replace('input-error', 'input-ru-email') : e.target.classList.replace('input-correct', 'input-ru-email');

      // TODO : ยกเลิก แสดงข้อความ error 
      spanErrorMessage.classList.value === 'error-message-ru-mail' ? spanErrorMessage.classList.replace('error-message-ru-mail', 'error-message-ru-mail-hidden') : spanErrorMessage.classList.add('error-message-ru-mail-hidden');

    }

  }

  onKeyUpPassword(e) {

    const passwordValue = e.target.value;

    // span tag สำหรับแสดงข้อความ error
    const sectionTagPassword = e.target.parentElement;
    const spanErrorMessage = sectionTagPassword.querySelector('span');

    if (passwordValue === '') {

      // TODO : แสดง border error สีแดง 
      e.target.classList.value === 'input-password' ? e.target.classList.replace('input-password', 'input-error') : e.target.classList.replace('input-correct', 'input-error');

      // TODO : แสดงข้อความ error input RU-Mail tag
      spanErrorMessage.classList.value === 'error-message-password-hidden' ? spanErrorMessage.classList.replace('error-message-password-hidden', 'error-message-password') : spanErrorMessage.classList.add('error-message-password');

    } else if (passwordValue.length > 3) {

      // TODO : ยกเลิก แสดง border error สีแดง หรือสีเทา
      // * เปลี่ยน border เป็นสีเขียว
      e.target.classList.value === 'input-password' ? e.target.classList.replace('input-password', 'input-correct') : e.target.classList.replace('input-error', 'input-correct');

      // TODO : ยกเลิก แสดง span error  สีแดง
      spanErrorMessage.classList.value === 'error-message-password' ? spanErrorMessage.classList.replace('error-message-password', 'error-message-password-hidden') : spanErrorMessage.classList.add('error-message-password-hidden');

    } else {

      // TODO : ยกเลิก แสดง span error  สีแดง
      spanErrorMessage.classList.value === 'error-message-password' ? spanErrorMessage.classList.replace('error-message-password', 'error-message-password-hidden') : spanErrorMessage.classList.add('error-message-password-hidden');

      // TODO : ยกเลิก แสดง border error สีแดง
      // เปลี่ยน border เป็น สีเทา
      e.target.classList.value === 'input-error' ? e.target.classList.replace('input-error', 'input-password') : e.target.classList.replace('input-correct', 'input-password');


    }

  }

  onOpenEye(e) {
    e.target.parentElement.querySelector('input').type = 'text';
    e.target.classList.value === 'img-password-eye-false' ? e.target.classList.replace('img-password-eye-false','img-password-eye-true') : false ;

    e.target.parentElement.querySelector('.img-password-eye-hide-true') !== null ? e.target.parentElement.querySelector('.img-password-eye-hide-true').classList.replace('img-password-eye-hide-true','img-password-eye-hide-false'): false;

  }

  onHiddenEye(e) {
    e.target.parentElement.querySelector('input').type = 'password';
    e.target.classList.value === 'img-password-eye-hide-false' ? e.target.classList.replace('img-password-eye-hide-false','img-password-eye-hide-true') : false ;


    e.target.parentElement.querySelector('.img-password-eye-true') !== null ? e.target.parentElement.querySelector('.img-password-eye-true').classList.replace('img-password-eye-true','img-password-eye-false'): false;

  }
}
