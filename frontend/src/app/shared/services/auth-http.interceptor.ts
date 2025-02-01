import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

  constructor(
    private toastr: ToastrService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.toastr.warning("Unauthorized (401)", "Warning", { timeOut: 3000 });
        } else if (error.status === 403) {
          this.toastr.warning("Forbidden (403)", "Warning", { timeOut: 3000 });
        } else if (error.status === 500) {
          this.toastr.error("Server error (500)", "Error", { timeOut: 3000 });
        }
        return throwError(() => error);
      })
    );
  }
}