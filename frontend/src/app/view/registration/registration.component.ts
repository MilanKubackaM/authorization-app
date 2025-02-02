import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { tap, catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-registration',
  standalone: true,
  templateUrl: './registration.component.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class RegistrationComponent {
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      return;
    }

    const { firstName, lastName, email, password } = this.registrationForm.value;

    this.authService.register(firstName, lastName, email, password)
      .pipe(
        tap(() => this.toastr.success('Registration successful', 'Success')),
        catchError(() => {
          this.toastr.error('Registration failed', 'Error');
          return EMPTY;
        })
      )
      .subscribe();
  }
}