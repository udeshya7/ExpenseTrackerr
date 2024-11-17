// src/app/core/guards/auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = getAuth().currentUser;
    console.log('Current user:', user); // Add this line for debugging
    if (user) {
      return true;
    } else {
      this.router.navigate(['/']); // Redirect to login if not authenticated
      return false;
    }
  }
  
}
