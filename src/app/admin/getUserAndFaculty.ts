export interface getUserAndFaculty {
  error_message: string;
  error_message_status: number;
  USERS: {
    USER_ID: string;
    USER_USERNAME: string;
    USER_FACULTY_NO: string;
    USER_ROLE_TYPE: string;
  }
  FACULTYS: {
    FACULTY_FACULTY_NO:        string;
    FACULTY_FACULTY_NAME_THAI: string;
  }
}

export interface setUserData {
    USER_ID: string;
    USER_USERNAME: string;
    USER_FACULTY_NO: string;
    USER_ROLE_TYPE: string;
}

export interface setFacultyData {
  FACULTY_FACULTY_NO:        string;
  FACULTY_FACULTY_NAME_THAI: string;
}


