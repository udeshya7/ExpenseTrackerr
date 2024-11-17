import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule} from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { routes } from './app.routes';
import { importProvidersFrom } from '@angular/core'; 
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./core/constants/constants";


const app = initializeApp(firebaseConfig);


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom([AngularFireModule.initializeApp(firebaseConfig),AngularFireAuthModule, AngularFireDatabaseModule, AngularFirestoreModule]) 
  ]
};
