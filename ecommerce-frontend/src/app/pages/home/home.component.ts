import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  successMessage = '';

  contactForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', Validators.required)
  });

  categories: any[] = [];

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private tosterService: ToastrService) { }

  ngOnInit() {
    this.getCategories();
  }

  selectCategory(id: string) {
    this.router.navigate(['/products', id]);
  }

  getCategories() {
    this.http.get<any[]>('http://localhost:5000/api/categories?limit=10')
      .subscribe(res => this.categories = res);
  }

  shopNow() {
    window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
  }

  submitForm() {
    if (this.contactForm.valid) {
      this.authService.sendMessage({
        name: this.contactForm.value.name!,
        email: this.contactForm.value.email!,
        message: this.contactForm.value.message!
      }).subscribe(
        () => {
          this.successMessage = 'Message sent successfully!';
          this.tosterService.success(this.successMessage); // success toast
          this.contactForm.reset();
        },
        (error) => {
          this.successMessage = 'Failed to send message. Please try again.';
          this.tosterService.error(this.successMessage); // error toast
          console.error('Send message error:', error);
        }
      );
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

}
