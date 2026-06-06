import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/IUser';
import { BASE_URL } from '../utils/appconstants';

@Injectable({
  providedIn: 'root'
})
export class Userservice {
  private baseUrl = BASE_URL + "/user/command";

  constructor(private http: HttpClient) {}


  updateProfile(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${user.id}`, user, { withCredentials: true }); 
  }

  getUserDetails(userId: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${userId}`, { withCredentials: true });
  }
}