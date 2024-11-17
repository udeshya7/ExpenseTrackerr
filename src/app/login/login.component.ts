import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service'; // Adjust path as necessary
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FirebaseError } from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,AngularFirestoreModule] // Include CommonModule here
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        await this.authService.loginWithEmail(email, password);
        this.router.navigate(['/expense']); // Navigate to expense page
      } catch (error) {
        const firebaseError = error as FirebaseError; // Cast error to FirebaseError
        console.error('Login failed:', firebaseError);
        alert(firebaseError.message); // Display the error message to the user
      }
    }
  }

   // Navigate to the signup page using Router
   navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }
}