import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { IExpense } from '../../core/models/common.model';
import { ExpenseService } from '../../core/services/expense.service';
import { getAuth } from 'firebase/auth';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
declare var Razorpay: any;

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
  standalone: true,
  imports: [CommonModule, BaseChartDirective]
})
export class ExpenseComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  expenses: IExpense[] = [];
  filteredExpenses: IExpense[] = [];
  uniqueCategories: string[] = [];
  totalExpenses = 0;
  expensesByCategory: { [key: string]: number } = {};

  // Define chart data and options
  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      }
    ]
  };
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };
  pieChartType: 'pie' = 'pie';
  http: any;

  constructor(private expenseService: ExpenseService, private router: Router) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    const user = getAuth().currentUser;
    if (user) {
      this.getAllExpenses();
    } else {
      this.router.navigate(['/']);
    }
  }

  getAllExpenses() {
    this.expenseService.getAllExpenses().subscribe({
      next: (data) => {
        this.expenses = [];
        this.totalExpenses = 0;

        data.forEach((item) => {
          let expense = item.payload.toJSON() as IExpense;
          this.totalExpenses += parseFloat(expense.price);
          this.expenses.push({
            key: item.key || '',
            title: expense.title,
            description: expense.description,
            price: expense.price,
            category: expense.category,
          });
        });

        this.uniqueCategories = [...new Set(this.expenses.map(exp => exp.category))];
        this.filteredExpenses = this.expenses; // Show all expenses initially
        this.expensesByCategory = this.calculateCategoryExpenses();
        this.updatePieChartData();
      },
      error: (error) => console.error('Error fetching expenses:', error),
    });
  }

  calculateCategoryExpenses() {
    const expensesByCategory: { [key: string]: number } = {};
    this.expenses.forEach((expense) => {
      if (!expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] = 0;
      }
      expensesByCategory[expense.category] += parseFloat(expense.price);
    });

    return expensesByCategory;
  }

  updatePieChartData() {
    this.pieChartData.labels = Object.keys(this.expensesByCategory);
    this.pieChartData.datasets[0].data = Object.values(this.expensesByCategory);

    if (this.chart) {
      this.chart.update();
    }
  }

  filterExpensesByCategory(category: string) {
    this.filteredExpenses = this.expenses.filter(expense => expense.category === category);
  }

  clearFilter() {
    this.filteredExpenses = this.expenses;
  }

  editExpense(key: string) {
    this.router.navigate(['/expense-form/' + key]);
  }

  navigateToForm() {
    this.router.navigate(['/expense-form']);
  }

  removeExpense(key: string) {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(key).then(() => {
        this.expenses = this.expenses.filter(expense => expense.key !== key);
        this.filteredExpenses = this.filteredExpenses.filter(expense => expense.key !== key);
        this.totalExpenses = this.expenses.reduce((sum, expense) => sum + parseFloat(expense.price), 0);
        this.expensesByCategory = this.calculateCategoryExpenses();
        this.updatePieChartData();
      }).catch((error) => {
        console.error('Error removing expense:', error);
      });
    }
  }

  payNow() {
    const RozarpayOptions = {
      description: 'Sample Razorpay demo',
      currency: 'INR',
      amount: 100000,
      name: 'TheOgre',
      key: 'rzp_test_Jq0zJhFVPjACrg',
      image: 'https://i.imgur.com/FApqk3D.jpeg',
      prefill: {
        name: 'TheOgre',
        email: 'Theogreamv@gmail.com',
        phone: '9000000008'
      },
      theme: {
        color: '#6466e3'
      },
      modal: {
        ondismiss:  () => {
          console.log('dismissed')
        }
      }
    }

    const successCallback = (paymentid: any) => {
      console.log(paymentid);
    }

    const failureCallback = (e: any) => {
      console.log(e);
    }

    Razorpay.open(RozarpayOptions,successCallback, failureCallback)
  }
  trackByExpense(index: number, expense: IExpense): string {
    return expense.key|| ''; // Assuming 'key' is unique for each expense
  }
}  