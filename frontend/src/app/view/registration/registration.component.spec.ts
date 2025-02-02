import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationComponent } from './registration.component';
import { AuthService } from '../../shared/services/auth.service';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [RegistrationComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
        provideToastr(),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should not call AuthService.register when form is invalid', () => {
    component.registrationForm.setValue({ firstName: '', lastName: '', email: '', password: '' }); 
    component.onSubmit();

    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should initialize the registration form', () => {
    expect(component.registrationForm).toBeDefined();
    expect(component.registrationForm.controls['firstName']).toBeDefined();
    expect(component.registrationForm.controls['lastName']).toBeDefined();
    expect(component.registrationForm.controls['email']).toBeDefined();
    expect(component.registrationForm.controls['password']).toBeDefined();
  });

  it('should mark form as invalid if required fields are empty', () => {
    component.registrationForm.setValue({ firstName: '', lastName: '', email: '', password: '' });
    expect(component.registrationForm.invalid).toBeTrue();
  });

  it('should mark email field as invalid if incorrect format is used', () => {
    component.registrationForm.controls['email'].setValue('invalid-email');
    expect(component.registrationForm.controls['email'].invalid).toBeTrue();
  });

  it('should successfully submit form and call AuthService', () => {
    component.registrationForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123'
    });
  
    // Oprava: AuthService teraz vracia objekt s tokenom
    authServiceSpy.register.and.returnValue(of({ token: 'mocked-token' }));
  
    component.onSubmit();
  
    expect(authServiceSpy.register).toHaveBeenCalledWith('John', 'Doe', 'johndoe@example.com', 'password123');
    expect(toastrSpy.success).toHaveBeenCalledWith('Registration successful', 'Success');
  });

  it('should show error message on failed registration', () => {
    component.registrationForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123'
    });

    authServiceSpy.register.and.returnValue(throwError(() => new Error('Registration failed')));

    component.onSubmit();

    expect(toastrSpy.error).toHaveBeenCalledWith('Registration failed', 'Error');
  });
});