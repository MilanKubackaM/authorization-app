import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://localhost:8080/api/v1/auth';
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
    return this.http.post<{ token: string }>(`${this.apiUrl}/authenticate`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          this.tokenSubject.next(response.token); 
        }
      })
    );
  }

  public register(firstName: string, lastName: string, email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, {
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