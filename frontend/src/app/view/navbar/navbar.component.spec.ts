import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../shared/services/auth.service';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getTokenObservable', 'logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success']);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
        provideToastr(),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if user is logged in', () => {
    authServiceSpy.getTokenObservable.and.returnValue(of('mockToken'));
    component.isLoggedIn$ = authServiceSpy.getTokenObservable();
    
    component.isLoggedIn$.subscribe((token) => {
      expect(token).toBe('mockToken');
    });
  });

  it('should logout and navigate to home', () => {
    component.logout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    expect(toastrSpy.success).toHaveBeenCalledWith('You have been logged out');
  });
});