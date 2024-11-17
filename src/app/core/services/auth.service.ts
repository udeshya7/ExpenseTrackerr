import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getAuth();
  private firestore: any;

  constructor(private router: Router) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('User is signed in:', user);
      } else {
        console.log('No user is signed in.');
      }
    });
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Login successful!');
      // Optionally, navigate or handle additional logic here
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Handle errors as necessary
    }
  }

  async logout(): Promise<void> {
    await this.auth.signOut();
    this.router.navigate(['/']); // Redirect to login
  }

  async registerWithEmail(username: string, email: string, password: string): Promise<void> {
    // Include logic to save the username in your database if needed
    // For example, you can save it in Firestore or Realtime Database after creating the user
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    // Save username to database
    const userId = userCredential.user.uid;
    await this.firestore.collection('users').doc(userId).set({ username, email });
  }
}