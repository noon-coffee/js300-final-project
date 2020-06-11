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
      currentMonth: 6,
      currentYear: 2020,
      currentMonthYearExpenses: [],
    }
  }

  componentDidMount() { 
    this.getExpenses(this.state.currentMonth, this.state.currentYear);
  }

  componentWillUnmount() {
    if (this.unsubscribeExpensesCollectionListener) {
        this.unsubscribeExpensesCollectionListener();
    }
  }

  getExpenses = (month, year) => {
    this.unsubscribeExpensesCollectionListener = firebase.firestore()
      .collection(dbCollectioNameExpenses)
      .where("expenseMonth", "==", month)
      .where("expenseYear", "==", year)
      .onSnapshot(
        snapshot => {
          this.setState({expenses: snapshot.docs});
          if (snapshot.docChanges().length === 1) { //to exclude initial load
            this.setDBMessage(snapshot.docChanges()[0].type);
          }
        },
        () => { //error
          this.setState({userNotification: 'A database error has occurred.'})
        }
      );
  }
  
  handleExpenseAdd = expense => {
    const expenseToAdd = {
      ...expense,
      createdOn: firebase.firestore.FieldValue.serverTimestamp(),
      updatedOn: null,
    }

    firebase.firestore()
      .collection(dbCollectioNameExpenses)
      .add(expenseToAdd);
  }

  handleExpenseDelete = id => { 

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

  setDBMessage = (changeType) => {
    if (changeType === 'added') {
      this.setState({userNotification: 'Expense added.'})
    }
    if (changeType === 'modified') {
      this.setState({userNotification: 'Expense modified.'})
    }
    if (changeType === 'removed') {
      this.setState({userNotification: 'Expense removed.'})
    }
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
          <ExpenseList />
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