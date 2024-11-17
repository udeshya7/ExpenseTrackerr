// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core'; 
// import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
// import { ExpenseService } from '../../core/services/expense.service';
// import { IExpense } from '../../core/models/common.model';
// import { ActivatedRoute, Router } from '@angular/router';

// @Component({
//   selector: 'app-expense-form',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './expense-form.component.html',
//   styleUrls: ['./expense-form.component.scss'] // Corrected here
// })
// export class ExpenseFormComponent implements OnInit {
//   expenseForm!: FormGroup;  // Corrected here
//   expenseId='';
//   constructor(private fb: FormBuilder, private expenseService:ExpenseService, private router: Router, private activatedRoute: ActivatedRoute  ) {
//     this.expenseForm = this.fb.group({
//       price: new FormControl('', [Validators.required]), // Corrected here
//       title: new FormControl('', [Validators.required]), // Corrected here
//       description: new FormControl(''),
//     });
//   }
//   ngOnInit():void{
//     this.activatedRoute.params.subscribe({
//       next:(params)=>{
//         this.expenseId= params ['id'];
//         this.getExpense(this.expenseId)
//       }
//     })
//   }  
  
//   onSubmit() {
//     if (this.expenseForm.valid) {
//       this.expenseService.addExpense(this.expenseForm.value);
//       this.router.navigate(['/expense']);
//     } else {
//       this.expenseForm.markAllAsTouched();
//     }
//   }

//   getExpense(key:string){
//     this.expenseService.getExpense(key).snapshotChanges().subscribe({
//       next:(data)=>{
//         let expense = data.payload.toJSON() as IExpense;
//         this.expenseForm.setValue(expense);
//       }
//     })
//   }

// }
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core'; 
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ExpenseService } from '../../core/services/expense.service';
import { IExpense } from '../../core/models/common.model';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss']
})
export class ExpenseFormComponent implements OnInit {
  expenseForm!: FormGroup;
  expenseId = '';
  isEditMode = false; // Flag for edit mode
  categories = ['Food', 'Entertainment', 'Transportation', 'Utilities', 'Other']; // Categories list

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.expenseForm = this.fb.group({
      price: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      category: new FormControl('', [Validators.required]), // Category control
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.expenseId = params['id'];
        if (this.expenseId) {
          this.isEditMode = true; // Set edit mode if an ID is present
          this.getExpense(this.expenseId);
        }
      }
    });
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const userId = getAuth().currentUser?.uid; // Get the current user ID
      const expenseData = { ...this.expenseForm.value, userId }; // Attach user ID

      if (this.isEditMode) {
        this.expenseService.updateExpense(this.expenseId, expenseData);
      } else {
        this.expenseService.addExpense(expenseData);
      }

      this.router.navigate(['/expense']); // Navigate back to the expense list
    } else {
      this.expenseForm.markAllAsTouched(); // Mark all fields as touched
    }
  }

  getExpense(key: string) {
    this.expenseService.getExpense(key).snapshotChanges().subscribe({
      next: (data) => {
        let expense = data.payload.toJSON() as IExpense;
        this.expenseForm.setValue(expense);
      }
    });
  }
}
