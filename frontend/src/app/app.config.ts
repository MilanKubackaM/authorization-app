import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthHttpInterceptor } from './shared/services/auth-http.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), 
    importProvidersFrom(BrowserAnimationsModule), 
    importProvidersFrom(ToastrModule.forRoot({
      positionClass: 'toast-top-right', 
      timeOut: 3000, 
      preventDuplicates: true 
    })),
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthHttpInterceptor, 
      multi: true 
    },
  ]
};