/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './app/core/constants/constants'; // Ensure the path is correct

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth(); // Initializes Firebase Authentication

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
