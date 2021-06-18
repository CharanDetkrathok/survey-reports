import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { environment } from "src/environments/environment.prod";
import { getUserAndFaculty, responeAfterInsert } from "../admin/getUserAndFaculty";

@Injectable({
  providedIn: 'root'
})

export class adminService {

  constructor(private httpUrl: HttpClient) { }

  getHttpUserAndFaculty() {

    return this.httpUrl.get<getUserAndFaculty>(`${environment._base_url}admin-get-user-faculty.jsp`);

  }

  postHttpAddUser(USERNAME,ROLE_TYPE, FACULTY_NO) {

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' });

    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('USERNAME', USERNAME);
    urlSearchParams.append('ROLE_TYPE', ROLE_TYPE);
    urlSearchParams.append('FACULTY_NO', FACULTY_NO);
    
    const body = urlSearchParams.toString();

    return this.httpUrl.post<responeAfterInsert>(`${environment._base_url}admin-add-user.jsp`, body, { headers: headers });

  }

}
