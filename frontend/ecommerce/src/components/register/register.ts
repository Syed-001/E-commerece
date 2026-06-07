import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.registerForm = this.fb.group({
      fullname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(4)]],
      confpass: ['', [Validators.required]],
      privpolicy: [false, [Validators.requiredTrue]]
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.authService.register({
        id: 0,
        username: this.registerForm.get('fullname')?.value,
        password: this.registerForm.get('pass')?.value,
        email: this.registerForm.get('email')?.value,
        address: '',
        userType: 1
      }).subscribe({
        next: () => {
          this.successMessage = 'Registration successful! Redirecting to login...';
          this.errorMessage = '';
          this.cdr.detectChanges();
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: () => {
          this.errorMessage = 'Registration failed. Please try again.';
          this.successMessage = '';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}