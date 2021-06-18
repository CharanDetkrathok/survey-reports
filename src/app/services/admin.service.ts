import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { environment } from "src/environments/environment.prod";
import { getUserAndFaculty } from "../admin/getUserAndFaculty";

@Injectable({
  providedIn: 'root'
})

export class adminService {

  constructor(private httpUrl: HttpClient) { }

  getHttpUserAndFaculty() {

    return this.httpUrl.get<getUserAndFaculty>(`http://sevkn.ru.ac.th/survey-api/admin-get-user-faculty.jsp`);

  }

}
