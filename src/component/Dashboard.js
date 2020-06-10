import React from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import UserAuthContext from '../context/UserAuthContext';
import ExpenseForm from './ExpenseForm';


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
      <main>
        <button onClick={this.handleSignOut}>Sign Out</button>
        <span className="user-notification">{this.state.userNotification}</span>
        <h2>Dashboard</h2>
        <ExpenseForm onExpenseAdd={this.handleExpenseAdd} />
      </main>
    );
  }
}