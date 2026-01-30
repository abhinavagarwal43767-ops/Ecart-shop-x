import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { encrypt } from '../../crypto.util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxSpinnerModule, ToastrModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.loginForm.reset();
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    this.spinner.show();

    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);

        // 🔐 encrypt & store email
        const encryptedEmail = encrypt(res.email);
        sessionStorage.setItem('userEmail', encryptedEmail);

        this.loginForm.reset();
        this.spinner.hide();
        this.toastr.success('Login successful!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(err.error.message || 'Login failed');
      }
    });
  }
  routertoRegister() {
    this.router.navigate(['/register']);
  }
}
