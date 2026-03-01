import { Injectable } from '@angular/core';
import { AdminObj } from '../../utils/AdminObj';
import { environment } from '../../enviroment';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export type LoginResponse = {
  admin: AdminObj,
  token: string
};

@Injectable({
  providedIn: 'root',
})

export class Auth {
  private baseUrl = environment.apiUrl;

  private globalAdmin = new BehaviorSubject<AdminObj | null>(this.getStoredAdmin());
  admin$ = this.globalAdmin.asObservable();

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((res) => {
        sessionStorage.setItem("token", res.token);
        sessionStorage.setItem("admin", JSON.stringify(res.admin));
        this.globalAdmin.next(res.admin)
      })
    )
  }

  logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("admin");
    this.globalAdmin.next(null);
  }

  getAdmin(){
    return this.globalAdmin.value;
  }

  getToken(){
    return sessionStorage.getItem('token');
  }

  isLoggedIn(){
    return !!this.getToken();
  }

  private getStoredAdmin():AdminObj | null {
    const admin =sessionStorage.getItem('admin');
    if(!admin) return null;
    return JSON.parse(admin)
  }

}

