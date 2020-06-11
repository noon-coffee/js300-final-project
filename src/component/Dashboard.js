import React from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import './Dashboard.css';
import UserAuthContext from '../context/UserAuthContext';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import Metrics from './Metrics'


const dbCollectioNameExpenses = 'expenses';

export default class Dashboard extends React.Component {
  static contextType = UserAuthContext;

  constructor(props) {
    super(props);

    this.state = {
      userNotification: "",
      displayMonth: 0,
      displayYear: 0,
      monthYearOptions: [],
      currentMonthYearExpenses: [],
    }
  }

  componentDidMount() {
    const today = new Date();
    const displayMonth = today.getMonth() + 1; //January is 0
    const displayYear = today.getFullYear();

    this.getExpenses(displayMonth, displayYear);
    this.buildMonthYearOptions();
  }

  buildMonthYearOptions = () => {
    firebase.firestore()
      .collection(dbCollectioNameExpenses)
      .get()
      .then(snapshot => {
        let monthYearOptions = []
        snapshot.forEach(doc => {   
          const docData = doc.data();
          const expenseMonth = docData.expenseMonth;
          const expenseYear = docData.expenseYear;

          const isFound = monthYearOptions.findIndex(option => 
            (option.expenseMonth === expenseMonth && option.expenseYear === expenseYear)) === 1;
          if (!isFound) {
            monthYearOptions.push({expenseMonth, expenseYear})
          }    
        })
        this.setState({monthYearOptions});
      })
      .catch(() => { //error
        this.setState({userNotification: 'An error occurred while retrieving expenses.'})
      });
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
        });
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
      .then(() => this.buildMonthYearOptions())
    //todo: rebuild view
  }

  handleExpenseDelete = id => { 

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
          <Metrics />
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
          <ExpenseForm onExpenseAdd={this.handleExpenseAdd} />
        </section>

        <footer id="footer-dashboard">
          <sub>Front-end Application Development: Course Final Project</sub>
        </footer>
      </main>
    );
  }
}