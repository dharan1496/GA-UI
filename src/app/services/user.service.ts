import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  login(loginName: string, password: string) {
    return this.http.get(
      `${environment.api}/User/LoginUser?loginName=${loginName}&password=${password}`
    );
  }

  addUser(user: User) {
    return this.http.post(`${environment.api}/User/AddUser`, user);
  }
}
