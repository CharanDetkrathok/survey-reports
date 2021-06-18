import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { adminService } from '../services/admin.service';
import { getUserAndFaculty, setFacultyData, setUserData } from './getUserAndFaculty';
import { ErrorStateMatcher } from '@angular/material/core';
import { ConfirmationDialogComponent, ConfirmDialogModel } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  // สำหรับเปลี่ยงเเปลง css class name เพื่อเปิด-ปิด ตัวเลือกคณะ
  facultyCodeOpenUp: boolean = false;

  __UserAndFaculty: getUserAndFaculty;
  __setUserData: setUserData;
  __setUserDataHasFacultyName = [];
  __setFacultyData: setFacultyData;

  dialog_confirm_result: string;

  addUserFormGroup = this.formBuilder.group({
    __addUserRuMail: ['', [Validators.required, Validators.email]],
    __addUserDepartment: ['', [Validators.required]],
    __addUserFaculty_no: ['']
  });

  editUserFormGroup = this.formBuilder.group({
    __editUserRuMail: [''],
    __editUserDepartment: [''],
    __editUserFaculty_no: ['']
  });

  constructor(
    private userAndFaculty: adminService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.callApiUserAndFaculty();

  }

  async callApiUserAndFaculty() {

    ///////// ------ เหลือทำ error handling ----------- ///////////////
    await this.userAndFaculty.getHttpUserAndFaculty().subscribe(res => {

      this.__UserAndFaculty = res;

      this.__setUserData = res.USERS;

      this.__setFacultyData = res.FACULTYS;

      // START --- ค้นหาชื่อ คณะ และสร้าง Object ใหม่เพื่อเก็บมัน เพื่อแสดงใน Lists ---
      let USER_ID = '';
      let USER_USERNAME = '';
      let USER_FACULTY_NO = '';
      let USER_ROLE_TYPE = '';
      let USER_FACULTY_NAME = '';

      for (const [key1, value1] of Object.entries(this.__setUserData)) {

        USER_ID = value1.USER_ID;
        USER_USERNAME = value1.USER_USERNAME;
        USER_FACULTY_NO = value1.USER_FACULTY_NO;
        USER_ROLE_TYPE = value1.USER_ROLE_TYPE;
        USER_FACULTY_NAME = '';

        this.__setUserDataHasFacultyName.push({ USER_ID, USER_USERNAME, USER_FACULTY_NO, USER_ROLE_TYPE, USER_FACULTY_NAME });

      }

      for (const [key1, value1] of Object.entries(this.__setUserDataHasFacultyName)) {

        for (const [key2, value2] of Object.entries(this.__setFacultyData)) {

          if (value1.USER_FACULTY_NO == value2.FACULTY_FACULTY_NO && value1.USER_FACULTY_NO != '') {

            USER_ID = value1.USER_ID;
            USER_USERNAME = value1.USER_USERNAME;
            USER_FACULTY_NO = value1.USER_FACULTY_NO;
            USER_ROLE_TYPE = value1.USER_ROLE_TYPE;
            USER_FACULTY_NAME = value2.FACULTY_FACULTY_NAME_THAI;

            const objIndex = this.__setUserDataHasFacultyName.findIndex(obj => obj.USER_ID === USER_ID);
            if (objIndex > -1) {
              this.__setUserDataHasFacultyName.splice(objIndex, 1);
            }

            this.__setUserDataHasFacultyName.push({ USER_ID, USER_USERNAME, USER_FACULTY_NO, USER_ROLE_TYPE, USER_FACULTY_NAME });

          }

        }

      }
      // END --- ค้นหาชื่อ คณะ และสร้าง Object ใหม่เพื่อเก็บมัน ---

    });

  }


  onKeyUpInputTagAddRuMail(event) {

    let tempRuMailAutocomplete = event.target.value;

    if (tempRuMailAutocomplete.substring(tempRuMailAutocomplete.length, tempRuMailAutocomplete.length - 2) == '@r') {

      event.target.value += `u.ac.th`;

    }

  }


  onEditUserItem(event, user_role_type) {


    if (user_role_type == 1) {

      let editUserItem = event.target.closest('tr');

      let inputTagRUmail = editUserItem.childNodes[0].firstChild;
      let inputTagKongPan = editUserItem.querySelector('input.input-kong-pan-display');
      let selectTagDepartments = editUserItem.querySelector('select.department-edit');

      let editBtn = editUserItem.childNodes[2].firstChild;
      let editSaveBtn = editUserItem.childNodes[2].firstElementChild.nextSibling;
      let editRefreshBtn = editSaveBtn.nextSibling;

      inputTagRUmail.classList.add('editUserOpen');
      inputTagRUmail.readOnly = false;
      inputTagKongPan.hidden = true;

      selectTagDepartments.classList.add('editUserOpen')
      selectTagDepartments.hidden = false;

      editBtn.hidden = true;
      editSaveBtn.hidden = false;
      editRefreshBtn.hidden = false;

    } else {

      let editUserItem = event.target.closest('tr');

      let inputTagRUmail = editUserItem.childNodes[0].firstChild;
      let inputTagFaculty = editUserItem.childNodes[1].firstChild;
      let selectTagFaculty = editUserItem.querySelector('select.faculty-code-edit');
      let selectTagDepartments = editUserItem.querySelector('select.department-edit');

      let editBtn = editUserItem.childNodes[2].firstChild;
      let editSaveBtn = editUserItem.childNodes[2].firstElementChild.nextSibling;
      let editRefreshBtn = editSaveBtn.nextSibling;

      selectTagDepartments.classList.add('editUserOpen')
      selectTagDepartments.value = 2;
      selectTagDepartments.hidden = false;

      inputTagRUmail.classList.add('editUserOpen');
      inputTagRUmail.readOnly = false;
      inputTagFaculty.hidden = true;
      selectTagFaculty.hidden = false;
      editBtn.hidden = true;
      editSaveBtn.hidden = false;
      editRefreshBtn.hidden = false;

    }


  }


  onEditUserItemRefresh(event, user_role_type) {

    if (user_role_type == 1) {

      let editUserItem = event.target.closest('tr');

      let inputTagRUmail = editUserItem.childNodes[0].firstChild;
      let inputTagKongPan = editUserItem.querySelector('input.input-kong-pan-display');
      let selectTagDepartments = editUserItem.querySelector('select.department-edit');

      let editBtn = editUserItem.childNodes[2].firstChild;
      let editSaveBtn = editUserItem.childNodes[2].firstElementChild.nextSibling;
      let editRefreshBtn = editSaveBtn.nextSibling;

      if (inputTagRUmail.value !== '') {

        inputTagRUmail.classList.remove('editUserOpen');
        selectTagDepartments.classList.remove('editUserOpen')

        inputTagRUmail.readOnly = true;
        inputTagKongPan.hidden = false;
        selectTagDepartments.hidden = true;
        editBtn.hidden = false;
        editSaveBtn.hidden = true;
        editRefreshBtn.hidden = true;

        if (editUserItem.querySelector('select.faculty-code-edit').hidden === false) {

          editUserItem.querySelector('select.faculty-code-edit').hidden = true;
          editUserItem.querySelector('select.faculty-code-edit').remove('editUserOpen')

        }

      } else {

        inputTagRUmail.placeholder = 'Enter your@ru.ac.th';

      }

    } else {

      let editUserItem = event.target.closest('tr');

      let inputTagRUmail = editUserItem.childNodes[0].firstChild;
      let inputTagFaculty = editUserItem.childNodes[1].firstChild;
      let selectTagFaculty = editUserItem.querySelector('select.faculty-code-edit');
      let selectTagDepartments = editUserItem.querySelector('select.department-edit');

      let editBtn = editUserItem.childNodes[2].firstChild;
      let editSaveBtn = editUserItem.childNodes[2].firstElementChild.nextSibling;
      let editRefreshBtn = editSaveBtn.nextSibling;

      if (inputTagRUmail.value !== '') {

        inputTagRUmail.classList.remove('editUserOpen');

        selectTagDepartments.classList.remove('editUserOpen')
        selectTagDepartments.value = '';
        selectTagDepartments.hidden = true;

        inputTagRUmail.readOnly = true;
        inputTagFaculty.hidden = false;
        selectTagFaculty.hidden = true;
        editBtn.hidden = false;
        editSaveBtn.hidden = true;
        editRefreshBtn.hidden = true;

      } else {

        inputTagRUmail.placeholder = 'Enter your@ru.ac.th';

      }

    }


  }


  onDeleteUserItem() {

    let deleteUserItem = document.querySelector('#user-item-btn-delete');

    console.log(deleteUserItem.parentElement);
  }


  onChangedDepartment(event) {

    let selectTagDepartments = event.target;
    let selectTagFaculty = event.target.parentElement.querySelector('select.faculty-code-edit');

    if (event.target.value == 2) {

      selectTagFaculty.classList.add('editUserOpen')
      selectTagFaculty.hidden = false;

    } else {

      selectTagFaculty.classList.remove('editUserOpen')
      selectTagFaculty.hidden = true;

    }

  }


  onChangedAddDepartment(event) {

    let selectTagDepartmentsOfFaculty = document.querySelector('select#addFacultyCode');
    let labelTagDepartmentsOfFaculty = document.querySelector('label#labelFaculty');

    if (event.target.value == 2) {

      selectTagDepartmentsOfFaculty.classList.remove('faculty-code-close');
      selectTagDepartmentsOfFaculty.classList.add('faculty-code');

      labelTagDepartmentsOfFaculty.classList.remove('label-faculty-close');
      labelTagDepartmentsOfFaculty.classList.add('label-faculty');

      this.addUserFormGroup.controls['__addUserFaculty_no'].setValidators([Validators.required]);
      this.addUserFormGroup.controls['__addUserFaculty_no'].updateValueAndValidity();

    } else {

      selectTagDepartmentsOfFaculty.classList.remove('faculty-code');
      selectTagDepartmentsOfFaculty.classList.add('faculty-code-close');

      labelTagDepartmentsOfFaculty.classList.remove('label-faculty');
      labelTagDepartmentsOfFaculty.classList.add('label-faculty-close');

      this.addUserFormGroup.controls['__addUserFaculty_no'].setValue('');
      this.addUserFormGroup.controls['__addUserFaculty_no'].setValidators([]);
      this.addUserFormGroup.controls['__addUserFaculty_no'].updateValueAndValidity();

    }
  }

  onAddUserSubmit() {

    console.log(this.addUserFormGroup);

    //-- ********** สำเร็จ แจ้งด้วย Dialog ******** --//

    const title = 'ยืนยันบันทึกผู้ใช้งาน';
    const message = 'ทำการบันทึกผู้ใช้งานเรียบร้อย';
    const description = '';
    const descriptionDetail = '';
    const btnLeftDisable = false;
    const btnRightDisable = false;
    const txtBtnLeft = 'CANCEL';
    const txtBtnRight = 'OK';

    const dialogData = new ConfirmDialogModel(title, message, description, descriptionDetail, btnLeftDisable, btnRightDisable, txtBtnLeft, txtBtnRight);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {

      this.dialog_confirm_result = dialogResult;
      if (this.dialog_confirm_result) {

        console.log('ok')

        this.__setUserDataHasFacultyName = [];
        this.callApiUserAndFaculty();

      }

      this.addUserFormGroup.controls['__addUserRuMail'].setValue('');
      this.addUserFormGroup.controls['__addUserRuMail'].setValidators([Validators.required, Validators.email]);
      this.addUserFormGroup.controls['__addUserRuMail'].updateValueAndValidity();

      let selectTagDepartmentsOfFaculty = document.querySelector('select#addFacultyCode');
      let labelTagDepartmentsOfFaculty = document.querySelector('label#labelFaculty');

      if (this.addUserFormGroup.controls['__addUserDepartment'].value == 2) {

        selectTagDepartmentsOfFaculty.classList.remove('faculty-code');
        selectTagDepartmentsOfFaculty.classList.add('faculty-code-close');

        labelTagDepartmentsOfFaculty.classList.remove('label-faculty');
        labelTagDepartmentsOfFaculty.classList.add('label-faculty-close');

        this.addUserFormGroup.controls['__addUserFaculty_no'].setValue('');
        this.addUserFormGroup.controls['__addUserFaculty_no'].setValidators([]);
        this.addUserFormGroup.controls['__addUserFaculty_no'].updateValueAndValidity();

      }

      this.addUserFormGroup.controls['__addUserDepartment'].setValue('');
      this.addUserFormGroup.controls['__addUserDepartment'].setValidators([Validators.required]);
      this.addUserFormGroup.controls['__addUserDepartment'].updateValueAndValidity();

    });

  }


}
