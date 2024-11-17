// import { Injectable } from '@angular/core';
// import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
// import { IExpense } from '../models/common.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class ExpenseService {
//   push(arg0: { key: string; title: string; description: string; price: string; }) {
//     throw new Error('Method not implemented.');
//   }
//   private dbPath = '/expenses';
//   expensesRef: AngularFireList<any>;

//   constructor(private db: AngularFireDatabase) { 
//     this.expensesRef=db.list(this.dbPath);
//   }

//   getAllExpenses(userId: string){
//     return this.expensesRef;
//   }

//   getExpense(key:string){
//     return this.db.object('${this.dbPath}/${key}');
//   }

//   addExpense(userId: string, expense: IExpense) {
//     return this.db.list(`${this.dbPath}/${userId}`).push(expense);
//   }
  

//   updateExpense(key:string,expense: IExpense){
//    this.expensesRef.update(key, expense)
//   }

//   deleteExpense(key:string){
//     return this.expensesRef.remove(key);
//   }
// }
// src/app/core/services/expense.service.ts

import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { IExpense } from '../models/common.model';
import { getAuth } from 'firebase/auth';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private dbPath = '/expenses';
  expensesRef: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) { 
    this.expensesRef = db.list(this.dbPath);
  }

  getAllExpenses() {
    const userId = getAuth().currentUser?.uid; // Get the current user's ID
    return this.db.list(`${this.dbPath}/${userId}`).snapshotChanges();
  }

  getExpense(key: string) {
    const userId = getAuth().currentUser?.uid; // Ensure we're getting the user's expense
    return this.db.object(`${this.dbPath}/${userId}/${key}`);
  }

  addExpense(expense: IExpense) {
    const userId = getAuth().currentUser?.uid; // Attach the user ID to the expense
    return this.db.list(`${this.dbPath}/${userId}`).push(expense);
  }
  
  updateExpense(key: string, expense: IExpense) {
    const userId = getAuth().currentUser?.uid;
    return this.db.list(`${this.dbPath}/${userId}`).update(key, expense);
  }

  deleteExpense(key: string) {
    const userId = getAuth().currentUser?.uid;
    return this.db.list(`${this.dbPath}/${userId}`).remove(key);
  }
  
  

}
