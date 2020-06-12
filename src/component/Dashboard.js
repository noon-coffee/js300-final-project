import React from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import './Dashboard.css';
import UserAuthContext from '../context/UserAuthContext';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import Metrics from './Metrics'
import DateHelper from '../utility/dateHelper';


const dbCollectioNameExpenses = 'expenses';

export default class Dashboard extends React.Component {
  static contextType = UserAuthContext;

  constructor(props) {
    super(props);

    this.minExpenseDate = "2019-12-01";
    this.now = new Date();
    this.state = {
      userNotification: "",
      displayMonth: 0,
      displayYear: 0,
      monthYearOptions: this.buildMonthYearOptions(),
      currentMonthYearExpenses: [],
    }
  }

  componentDidMount() {
    const displayMonth = this.now.getMonth() + 1; //January is 0
    const displayYear = this.now.getFullYear();  
    this.getExpenses(displayMonth, displayYear);
  }

  buildMonthYearOptions = () => {
    const start = this.minExpenseDate;
    const end = DateHelper.getCalendarDateString(this.now);
    return DateHelper.getMonthYearOptions(start, end);
  }

  getExpenses = (month, year) => {
    firebase.firestore()
      .collection(dbCollectioNameExpenses)
      .where("expenseMonth", "==", month)
      .where("expenseYear", "==", year)
      .get()
      .then(snapshot => {
        let expenses = [];
        snapshot.forEach(doc => {
          expenses.push({
            id: doc.id,
            ...doc.data()
          })
        });

        this.setState({
          currentMonthYearExpenses: expenses,
          displayMonth: month,
          displayYear: year,
        })
      })
      .catch(() => { //error
        this.setState({userNotification: 'An error occurred while retrieving expenses.'})
      });
  }
  
  handleExpenseAdd = expense => {
    const expenseToAdd = {
      ...expense,
      createdOn: firebase.firestore.FieldValue.serverTimestamp(),
      updatedOn: null,
    }

    firebase.firestore()
      .collection(dbCollectioNameExpenses)
      .add(expenseToAdd)
      .then(() => {
        // Should only need to refresh the expense list if the newly added expense is to be displayed in the current year-month view;
        // otherwise, a get will be performed upon year-month selection change.
        const {displayMonth, displayYear} = this.state;
        if (expenseToAdd.expenseMonth === displayMonth && expenseToAdd.expenseYear === displayYear) {
          this.getExpenses(displayMonth, displayYear);
        }
      })
      .catch(() => console.log('Error adding expense.'));
  }

  handleExpenseDelete = id => { 
    firebase.firestore()
      .collection(dbCollectioNameExpenses)
      .doc(id)
      .delete()
      .then(() => {
        this.getExpenses(this.state.displayMonth, this.state.displayYear);
      })
      .catch(() => console.log('Error removing expense.'));
  }

  handleMonthYearChange = (year, month) => {
    this.getExpenses(month, year);
  }

  handleSignOut = e => {
    e.preventDefault();

    firebase
      .auth()
      .signOut()
      .then(() => {
        this.context.setIsUserAuthenticated(false);
        this.props.history.push('/');
      })
      .catch(() => {
        this.setState({userNotification: 'An error occurred while attempting to sign out.'});
      })
  }

  render() {
    return (
      <main id="container-main-dashboard">
        <header id="header-dashboard">
          <h1>Follow the Bucks <sub>(An Expense Tracker)</sub></h1>
          <div>
            <button onClick={this.handleSignOut}>Sign Out</button>
            <p>Hello, Responsible Spender</p>
          </div>
        </header>

        <section id="section-notifications">
          <span className="user-notification">{this.state.userNotification}</span>
        </section>

        <section id="section-metrics">
          <Metrics
            expenses={this.state.currentMonthYearExpenses} 
          />
        </section>

        <section id="section-expense-list">
          <ExpenseList 
            expenses={this.state.currentMonthYearExpenses} 
            displayMonth={this.state.displayMonth}
            displayYear={this.state.displayYear}
            monthYearOptions={this.state.monthYearOptions}
            onMonthYearChange={this.handleMonthYearChange} 
            onExpenseDelete={this.handleExpenseDelete}
          />
        </section>
        
        <section id="section-expense-add">  
          <ExpenseForm
            minExpenseDate={this.minExpenseDate}
            today = {this.now}
            onExpenseAdd={this.handleExpenseAdd} 
          />
        </section>

        <footer id="footer-dashboard">
          <sub>Front-end Application Development: Course Final Project</sub>
        </footer>
      </main>
    );
  }
}