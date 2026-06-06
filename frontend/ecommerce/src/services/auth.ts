import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, AuthResponse, RegisterRequest } from '../interfaces/IAuth';
import { BASE_URL } from '../utils/appconstants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = BASE_URL + "/user/command";

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials, {
      withCredentials: true
    });
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {  
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, userData); 
  }

  saveSession(userType: number, username: string) { 
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('userType', userType.toString());
      sessionStorage.setItem('username', username);  
      sessionStorage.setItem('userId', username);
    }
  }

  isLoggedIn(): boolean {
    if (typeof sessionStorage !== 'undefined') {
      return !!sessionStorage.getItem('userType');
    }
    return false;
  }

  logout() {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
  }
}