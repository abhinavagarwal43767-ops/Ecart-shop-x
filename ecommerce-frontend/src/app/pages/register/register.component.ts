import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxSpinnerModule, ToastrModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.registerForm.reset();
  }

  register() {
    if (this.registerForm.invalid) return;

    this.spinner.show();

    this.auth.register(this.registerForm.value).subscribe({
      next: () => {
        this.registerForm.reset();
        this.spinner.hide();
        this.toastr.success('Registration successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(err.error.message || 'Registration failed');
      }
    });
  }

  routertoLogin() {
    this.router.navigate(['/login']);
  }
}
