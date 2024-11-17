import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth'; // Import Firebase Auth
import { firebaseConfig } from './core/constants/constants';
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // Fix: should be styleUrls, not styleUrl
})
export class AppComponent {
  title = 'my-CRUD-app';

  constructor(private router: Router) {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig); // Directly use the configuration
    const firestore = getFirestore(app); // Initialize Firestore
    const auth = getAuth(app); // Initialize Auth
  }

  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      console.log('User signed out.');
      this.router.navigate(['/login']); // Navigate to login page after logout
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  }
}
