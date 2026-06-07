import { ChangeDetectorRef, Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { LoginRequest } from '../../interfaces/IAuth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  loginSuccess: boolean = false;
  loginMessage: string = '';
  private platformId = inject(PLATFORM_ID);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      pass: ['', Validators.required],
    });
  }

  doLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials: LoginRequest = {
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('pass')?.value,
    };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        this.authService.saveSession(res.userType, res.username);

        this.loginSuccess = true;
        this.loginMessage = res.message;
        this.cdr.detectChanges();

        if (res.userType === 0) {
          this.router.navigate(['/admin/products']);
        } else {
          this.router.navigate(['/customer/catalogue']);
        }
      },
      error: (err) => {
        this.loginSuccess = false;
        this.loginMessage = 'Login failed. Please check your credentials.';
        this.cdr.detectChanges();
      }
    });
  }
}