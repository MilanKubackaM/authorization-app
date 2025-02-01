import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private API_URL = 'http://localhost:8080/api/v1';

  public getSecret(): Observable<string> {
    return this.authService.getTokenObservable().pipe(
      map(token => ({ Authorization: `Bearer ${token}` })), 
      switchMap(headers =>
        this.http.get(`${this.API_URL}/info`, { headers, responseType: 'text' }).pipe(
          catchError(error => {
            return of(error.error || 'Unknown error');
          })
        )
      )
    );
  }

}