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
      this.addUserFormGroup.controls['__addUserRuMail'].setValue(event.target.value);

    }

    let inputTagRUmail = event.target;

    if (tempRuMailAutocomplete == '' || !event.target.value.includes(`@ru.ac.th`) || event.target.value.substr(-9) != `@ru.ac.th`) {

      inputTagRUmail.classList.remove('input-ru-email-correct');
      inputTagRUmail.classList.add('input-ru-email-wrong');
      // event.target.closest('form').querySelector('select.select-department-code').classList.add('input-ru-email-warning');

    } else {

      inputTagRUmail.classList.add('input-ru-email-correct');
      inputTagRUmail.classList.remove('input-ru-email-wrong');

      event.target.closest('form').querySelector('select.select-department-code').classList.add('input-ru-email-wrong');

    }

  }

  onKeyUpInputTagEditRuMail(event) {

    let tempRuMailAutocomplete = event.target.value;

    if (tempRuMailAutocomplete.substring(tempRuMailAutocomplete.length, tempRuMailAutocomplete.length - 2) == '@r') {

      event.target.value += `u.ac.th`;
      this.addUserFormGroup.controls['__addUserRuMail'].setValue(event.target.value);

    }

    let inputTagRUmail = event.target;

    // let editBtn = event.target.closest('tr').querySelector('button.edit');
    let editSaveBtn = event.target.closest('tr').querySelector('button.edit-save');
    let editRefreshBtn = event.target.closest('tr').querySelector('button.edit-refresh');

    if (tempRuMailAutocomplete == '' || !event.target.value.includes(`@ru.ac.th`) || event.target.value.substr(-9) != `@ru.ac.th`) {

      inputTagRUmail.classList.add('input-ru-email-wrong');

      editSaveBtn.disabled = true;
      // editRefreshBtn.disabled = true;


    } else {


      inputTagRUmail.classList.remove('input-ru-email-wrong');

      editSaveBtn.disabled = false;
      // editRefreshBtn.disabled = false;

    }

  }


  onEditUserItem(event, userId, userUsername, userFacultyNo, userRoleType) {


    if (userRoleType == 1) {

      let editUserItem = event.target.closest('tr');

      let inputTagRUmail = editUserItem.querySelector('input.input-user-name');
      let inputTagKongPan = editUserItem.querySelector('input.input-kong-pan-display');
      let selectTagDepartments = editUserItem.querySelector('select.department-edit');

      let editBtn = editUserItem.querySelector('button.edit');
      let editSaveBtn = editUserItem.querySelector('button.edit-save');
      let editRefreshBtn = editUserItem.querySelector('button.edit-refresh');

      inputTagRUmail.classList.add('editUserOpen');
      inputTagRUmail.readOnly = false;
      inputTagKongPan.hidden = true;

      selectTagDepartments.classList.add('editUserOpen');
      selectTagDepartments.hidden = false;

      editBtn.hidden = true;
      editSaveBtn.hidden = false;
      editRefreshBtn.hidden = false;

      inputTagRUmail.value = userUsername;
      inputTagKongPan.value = `กองแผน`;
      selectTagDepartments.value = userRoleType;

    } else {

      let editUserItem = event.target.closest('tr');

      let inputTagRUmail = editUserItem.querySelector('input.input-user-name');
      let inputTagFaculty = editUserItem.querySelector('input.input-faculty-display');

      let selectTagFaculty = editUserItem.querySelector('select.faculty-code-edit');
      let selectTagDepartments = editUserItem.querySelector('select.department-edit');

      let editBtn = editUserItem.querySelector('button.edit');
      let editSaveBtn = editUserItem.querySelector('button.edit-save');
      let editRefreshBtn = editUserItem.querySelector('button.edit-refresh');

      selectTagDepartments.classList.add('editUserOpen');
      selectTagDepartments.value = 2;
      selectTagDepartments.hidden = false;

      inputTagRUmail.classList.add('editUserOpen');
      inputTagRUmail.readOnly = false;
      inputTagFaculty.hidden = true;
      selectTagFaculty.hidden = false;
      editBtn.hidden = true;
      editSaveBtn.hidden = false;
      editRefreshBtn.hidden = false;

      inputTagRUmail.value = userUsername;
      selectTagFaculty.value = userFacultyNo;
      selectTagDepartments.value = userRoleType;

    }



    // check ว่าข้อมูลในช่อง email & department มีการแก้ไขหรือยัง ถ้าไม่มีการแก้ไข ทำการปิด (disabled) ปุ่มบันทึกการแก้ไข

    // if(username == || userRoleType) {

    // } else {

    // }


  }

  onEditUserItemRefresh(event, userId, userUsername, userFacultyNo, userRoleType) {

    console.log(event);

    if (userRoleType == 1) {

      let editUserItem = event.target.closest('tr');

      let inputTagRUmail = editUserItem.querySelector('input.input-user-name');
      let inputTagKongPan = editUserItem.querySelector('input.input-kong-pan-display');
      let selectTagDepartments = editUserItem.querySelector('select.department-edit');

      let editBtn = editUserItem.querySelector('button.edit');
      let editSaveBtn = editUserItem.querySelector('button.edit-save');
      let editRefreshBtn = editUserItem.querySelector('button.edit-refresh');


      inputTagRUmail.classList.remove('input-ru-email-wrong');
      inputTagRUmail.classList.remove('editUserOpen');
      selectTagDepartments.classList.remove('editUserOpen');

      inputTagRUmail.readOnly = true;
      inputTagKongPan.hidden = false;
      selectTagDepartments.hidden = true;
      editBtn.hidden = false;
      editSaveBtn.hidden = true;
      editSaveBtn.disabled = false;
      editRefreshBtn.hidden = true;
      editRefreshBtn.disabled = false;

      if (editUserItem.querySelector('select.faculty-code-edit').hidden === false) {

        editUserItem.querySelector('select.faculty-code-edit').hidden = true;
        editUserItem.querySelector('select.faculty-code-edit').remove('editUserOpen');

      }

      inputTagRUmail.value = userUsername;
      inputTagKongPan.value = `กองแผน`;
      selectTagDepartments.value = userRoleType;



    } else {


      let editUserItem = event.target.closest('tr');

      let inputTagRUmail = editUserItem.querySelector('input.input-user-name');
      let inputTagFaculty = editUserItem.querySelector('input.input-faculty-display');
      let selectTagFaculty = editUserItem.querySelector('select.faculty-code-edit');
      let selectTagDepartments = editUserItem.querySelector('select.department-edit');

      let editBtn = editUserItem.querySelector('button.edit');
      let editSaveBtn = editUserItem.querySelector('button.edit-save');
      let editRefreshBtn = editUserItem.querySelector('button.edit-refresh');

      inputTagRUmail.classList.remove('input-ru-email-wrong');
      inputTagRUmail.classList.remove('editUserOpen');
      selectTagDepartments.classList.remove('editUserOpen');

      selectTagDepartments.value = '';
      selectTagDepartments.hidden = true;

      inputTagRUmail.readOnly = true;
      inputTagFaculty.hidden = false;
      selectTagFaculty.hidden = true;
      editBtn.hidden = false;
      editSaveBtn.hidden = true;
      editSaveBtn.disabled = false;
      editRefreshBtn.hidden = true;
      editRefreshBtn.disabled = false;



      inputTagRUmail.placeholder = 'กรอก ru-mail@ru.ac.th';


      inputTagRUmail.value = userUsername;
      selectTagFaculty.value = userFacultyNo;
      selectTagDepartments.value = userRoleType;

    }


  }

  onChangedDepartment(event, userFacultyNo) {

    let selectTagDepartments = event.target;
    let selectTagFaculty = event.target.closest('tr').querySelector('select#department-edit-faculty');

    let editSaveBtn = event.target.closest('tr').querySelector('button.edit-save');

    if (event.target.value == 2) {

      selectTagFaculty.hidden = false;

      if (userFacultyNo.toString() == '') {

        selectTagFaculty.classList.add('editUserOpen-when-without-faculty-no');
        selectTagFaculty.classList.remove('editUserOpen');
        // selectTagFaculty.classList.remove('faculty-code-edit');

        editSaveBtn.disabled = true;

      } else {

        selectTagFaculty.classList.remove('editUserOpen-when-without-faculty-no');
        selectTagFaculty.classList.add('editUserOpen');

        editSaveBtn.disabled = false;

      }

    } else {
      
      selectTagFaculty.classList.remove('editUserOpen-when-without-faculty-no');
      selectTagFaculty.classList.remove('editUserOpen');

      selectTagFaculty.hidden = true;
      editSaveBtn.disabled = false;

    }

  }

  onChangedDepartmentSelectedFaculty(event) {

    let editSaveBtn = event.target.closest('tr').querySelector('button.edit-save');;
    let selectTagFaculty = event.target;

    if (event.target.value == '' || event.target.value == null) {

      editSaveBtn.disabled = true;

      selectTagFaculty.classList.add('editUserOpen-when-without-faculty-no');
      selectTagFaculty.classList.remove('editUserOpen');

    } else {

      editSaveBtn.disabled = false;

      selectTagFaculty.classList.remove('editUserOpen-when-without-faculty-no');
      selectTagFaculty.classList.add('editUserOpen');

    }

  }


  onChangedAddDepartment(event) {

    let selectTagDepartmentsOfFaculty = document.querySelector('select#addFacultyCode');
    let labelTagDepartmentsOfFaculty = document.querySelector('label#labelFaculty');

    if (event.target.value == 2) {

      event.target.closest('form').querySelector('select.select-department-code').classList.remove('input-ru-email-wrong');
      // event.target.closest('form').querySelector('select.select-department-code').classList.remove('input-ru-email-warning');
      event.target.closest('form').querySelector('select.select-department-code').classList.add('input-ru-email-correct');

      document.querySelector('select#addFacultyCode').classList.add('input-ru-email-wrong');

      selectTagDepartmentsOfFaculty.classList.remove('faculty-code-close');
      selectTagDepartmentsOfFaculty.classList.add('faculty-code');

      labelTagDepartmentsOfFaculty.classList.remove('label-faculty-close');
      labelTagDepartmentsOfFaculty.classList.add('label-faculty');

      this.addUserFormGroup.controls['__addUserFaculty_no'].setValidators([Validators.required]);
      this.addUserFormGroup.controls['__addUserFaculty_no'].updateValueAndValidity();

    } else if (event.target.value == 1) {

      event.target.closest('form').querySelector('select.select-department-code').classList.remove('input-ru-email-wrong');
      // event.target.closest('form').querySelector('select.select-department-code').classList.remove('input-ru-email-warning');
      event.target.closest('form').querySelector('select.select-department-code').classList.add('input-ru-email-correct');

      document.querySelector('select#addFacultyCode').classList.remove('input-ru-email-wrong');

      selectTagDepartmentsOfFaculty.classList.remove('faculty-code');
      selectTagDepartmentsOfFaculty.classList.add('faculty-code-close');

      labelTagDepartmentsOfFaculty.classList.remove('label-faculty');
      labelTagDepartmentsOfFaculty.classList.add('label-faculty-close');

      this.addUserFormGroup.controls['__addUserFaculty_no'].setValue('');
      this.addUserFormGroup.controls['__addUserFaculty_no'].setValidators([]);
      this.addUserFormGroup.controls['__addUserFaculty_no'].updateValueAndValidity();

    } else {

      event.target.closest('form').querySelector('select.select-department-code').classList.add('input-ru-email-wrong');
      // event.target.closest('form').querySelector('select.select-department-code').classList.remove('input-ru-email-warning');
      event.target.closest('form').querySelector('select.select-department-code').classList.remove('input-ru-email-correct');

      document.querySelector('select#addFacultyCode').classList.remove('input-ru-email-wrong');

      selectTagDepartmentsOfFaculty.classList.remove('faculty-code');
      selectTagDepartmentsOfFaculty.classList.add('faculty-code-close');

      labelTagDepartmentsOfFaculty.classList.remove('label-faculty');
      labelTagDepartmentsOfFaculty.classList.add('label-faculty-close');

      this.addUserFormGroup.controls['__addUserFaculty_no'].setValue('');
      this.addUserFormGroup.controls['__addUserFaculty_no'].setValidators([]);
      this.addUserFormGroup.controls['__addUserFaculty_no'].updateValueAndValidity();

    }

  }

  onChangedAddFaculty(event) {


    let selectTagDepartmentsOfFaculty = document.querySelector('select#addFacultyCode');

    console.log(event.target.value);

    if (event.target.value == '' || event.target.value == null) {

      selectTagDepartmentsOfFaculty.classList.add('input-ru-email-wrong');
      selectTagDepartmentsOfFaculty.classList.remove('input-ru-email-correct');

    } else {

      selectTagDepartmentsOfFaculty.classList.remove('input-ru-email-wrong');
      selectTagDepartmentsOfFaculty.classList.add('input-ru-email-correct');


    }


  }

  onSaveEditUser(event, userId, userName, userFacultyName, userRoleType) { /// ----- Save data editing --- /// 


    console.log(`${event}, id: ${userId}, email: ${userName}, faculty: ${userFacultyName}, role: ${userRoleType}`);

  }


  onDeleteUserItem(event, userId, username) { /// ------ Delete user -------- ///

    const title = 'ลบผู้ใช้งาน';
    const message = `ท่านต้องการ ลบผู้ใช้งาน ${username} หรือไม่`;
    const description = ``;
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

        this.userAndFaculty.postHttpDeleteUser(userId).subscribe(res => {

          console.log(res);
          console.log(res.error_message_status);
          console.log(res.error_message_from_user);
          console.log(res.error_message_delete_from_system);

          if (res.error_message_status == 1) {

            const title = 'ลบผู้ใช้งาน';
            const message = `ทำการลบผู้ใช้งาน ${username} เรียบร้อย`;
            const description = ``;
            const descriptionDetail = '';
            const btnLeftDisable = true;
            const btnRightDisable = false;
            const txtBtnLeft = '';
            const txtBtnRight = 'OK';

            const dialogData = new ConfirmDialogModel(title, message, description, descriptionDetail, btnLeftDisable, btnRightDisable, txtBtnLeft, txtBtnRight);
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              data: dialogData
            });

            dialogRef.afterClosed().subscribe(dialogResult => {

              this.dialog_confirm_result = dialogResult;
              if (this.dialog_confirm_result) {


                // ลบสำเร็จ จัดเรียงข้อมูลที่จะแสดงใหม่
                this.__setUserDataHasFacultyName = [];
                this.callApiUserAndFaculty();


              }

            });


          } else {

            const title = 'ลบผู้ใช้งาน';
            const message = `ไม่สามารถทำการลบผู้ใช้งาน ${username} ได้`;
            const description = ``;
            const descriptionDetail = '';
            const btnLeftDisable = true;
            const btnRightDisable = false;
            const txtBtnLeft = '';
            const txtBtnRight = 'OK';

            const dialogData = new ConfirmDialogModel(title, message, description, descriptionDetail, btnLeftDisable, btnRightDisable, txtBtnLeft, txtBtnRight);
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              data: dialogData
            });

            dialogRef.afterClosed().subscribe(dialogResult => {

              this.dialog_confirm_result = dialogResult;
              if (this.dialog_confirm_result) {
                //// ลบไม่ได้ ก็ไม่ทำไรต่อ จบ
              }

            });

          }


        });

      }

    });


  }/// ------ Delete user -------- ///




  onAddUserSubmit() { /// ----- insert user ------ ///

    //-- ********** สำเร็จ แจ้งด้วย Dialog ******** --//
    const title = 'ยืนยันบันทึกผู้ใช้งาน';
    const message = 'ท่านต้องการ บันทึกผู้ใช้งานหรือไม่';
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

        let username = this.addUserFormGroup.controls['__addUserRuMail'].value;
        let role_type = this.addUserFormGroup.controls['__addUserDepartment'].value;
        let faculty_no = this.addUserFormGroup.controls['__addUserFaculty_no'].value;

        this.userAndFaculty.postHttpAddUser(username, role_type, faculty_no).subscribe(res => {

          if (res.error_message_status == 1) {

            const title = 'เพิ่มผู้ใช้งาน';
            const message = 'ไม่สามารถเพิ่มผู้ใช้งานนี้ได้';
            const description = `เนื่องจาก ${username} นี้มีอยู่ในระบบแล้ว`;
            const descriptionDetail = '';
            const btnLeftDisable = true;
            const btnRightDisable = false;
            const txtBtnLeft = '';
            const txtBtnRight = 'OK';

            const dialogData = new ConfirmDialogModel(title, message, description, descriptionDetail, btnLeftDisable, btnRightDisable, txtBtnLeft, txtBtnRight);
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              data: dialogData
            });

            dialogRef.afterClosed().subscribe(dialogResult => {

              this.dialog_confirm_result = dialogResult;
              if (this.dialog_confirm_result) {

              }

            });

          } else if (res.error_message_status == 2) {

            const title = 'เพิ่มผู้ใช้งาน';
            const message = `เพิ่มผู้ใช้งานเรียบร้อย ${username}`;
            const description = ``;
            const descriptionDetail = '';
            const btnLeftDisable = true;
            const btnRightDisable = false;
            const txtBtnLeft = '';
            const txtBtnRight = 'OK';

            const dialogData = new ConfirmDialogModel(title, message, description, descriptionDetail, btnLeftDisable, btnRightDisable, txtBtnLeft, txtBtnRight);
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              data: dialogData
            });

            dialogRef.afterClosed().subscribe(dialogResult => {

              this.dialog_confirm_result = dialogResult;
              if (this.dialog_confirm_result) {

              }

            });

            this.__setUserDataHasFacultyName = [];
            this.callApiUserAndFaculty();

          }


        });

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

    document.querySelector('select.select-department-code').classList.remove('input-ru-email-wrong');
    // document.querySelector('select.select-department-code').classList.remove('input-ru-email-warning');
    document.querySelector('select.select-department-code').classList.remove('input-ru-email-correct');

    document.querySelector('.input-ru-email').classList.remove('input-ru-email-wrong');
    // document.querySelector('.input-ru-email').classList.remove('input-ru-email-warning');
    document.querySelector('.input-ru-email').classList.remove('input-ru-email-correct');

  }/// ----- insert user ------ ///


}
