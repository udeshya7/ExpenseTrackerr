import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AngularFirestoreModule,
    HttpClientModule
  ]
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  emailOtp: string = '';
  emailOtpSent: boolean = false;
  emailVerified: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string='';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      emailOtp: ['', Validators.required] // Add OTP control

    });
  }

  ngOnInit(): void {}

  async requestOtp() {
    const email = this.signupForm.get('email')?.value;
    if (email) {
      this.isLoading = true;
      this.errorMessage = ''; // Clear previous error
      try {
        await this.http.post('http://localhost:5000/api/user/request-otp', { email }).toPromise();
        this.emailOtpSent = true;
        console.log('OTP sent to email!');
      } catch (error) {
        this.errorMessage = 'Error sending OTP. Please try again.';
        console.error('Error sending OTP:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  async verifyOtp() {
    const email = this.signupForm.get('email')?.value;
    const otp = this.signupForm.get('emailOtp')?.value; // Get OTP from form control
    this.isLoading = true;
    this.errorMessage = ''; // Clear previous error
    try {
      await this.http.post('http://localhost:5000/api/user/verify-otp', { email, otp }).toPromise();
      this.emailVerified = true;
      console.log('Email verified successfully!');
    } catch (error) {
      this.errorMessage = 'Error verifying OTP. Please check and try again.';
      console.error('Error verifying OTP:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit() {
    if (this.emailVerified && this.signupForm.valid) {
      const { username, email, password } = this.signupForm.value;
      try {
        // Call your signup method in AuthService here
        // Example: await this.authService.register(username, email, password);
        console.log('User registered:', { username, email, password });
        this.successMessage = 'User registered successfully!';
        this.router.navigate(['/login']); // Navigate to login page
      } catch (error) {
        this.errorMessage = 'Registration failed. Please try again.';
        console.error('Registration error: ', error);
      }
    } else {
      this.errorMessage = 'Please verify your email before submitting.';
      console.error('Submission error: ', this.errorMessage);
    }
  }
  

  navigateToLogin() {
    this.router.navigate(['/']);
  }
}
