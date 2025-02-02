import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private API_URL = environment.apiUrl;
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));

  constructor(private http: HttpClient) {
    this.tokenSubject.subscribe(token => {
      if (token) {
        localStorage.setItem('token', token); 
      } else {
        localStorage.removeItem('token');
      }
    });
  }

  public login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.API_URL}/authenticate`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          this.tokenSubject.next(response.token); 
        }
      })
    );
  }

  public register(firstName: string, lastName: string, email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.API_URL}/register`, {
      firstName,
      lastName,
      email,
      password
    })
  }

  public logout(): void {
    this.tokenSubject.next(null); 
  }

  public getTokenObservable(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  public setToken(token: string){
    this.tokenSubject.next(token);
  }
}