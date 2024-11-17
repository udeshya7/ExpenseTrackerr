import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { ExpenseComponent } from './pages/expense/expense.component';
import { ExpenseFormComponent } from './pages/expense-form/expense-form.component';
import { AuthGuard } from './core/auth.guard';
import { LoginComponent } from './login/login.component';
export const routes: Routes = [
  { path: '', component: LoginComponent}, 
  { path: 'signup', component: SignupComponent },
  { path: 'expense', component: ExpenseComponent, canActivate: [AuthGuard] },
  { path: 'expense-form', component: ExpenseFormComponent, canActivate: [AuthGuard] },
  { path: 'expense-form/:id', component: ExpenseFormComponent, canActivate: [AuthGuard] },
];