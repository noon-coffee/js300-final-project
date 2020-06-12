import React from 'react';
import DateHelper from '../utility/dateHelper';
import {expenseCategories} from '../utility/category';


export default class ExpenseList extends React.Component {
  handleMonthYearSelection = e => {
    const monthYearParts = DateHelper.getMonthYearOptionParts(e.target.value);
    this.props.onMonthYearChange(monthYearParts.yearNum, monthYearParts.monthNum);
  }

  render() {
    const {expenses, displayMonth, displayYear, monthYearOptions, onExpenseDelete} = this.props;

    return(
      <div className="container-section">
        <h2>Expense List</h2>

        <div>
          <span>View expenses for year-month: </span>
          <select 
            name="monthYear" 
            id="monthYear" 
            className="control"
            value={DateHelper.formatMonthYearOptionValue(displayYear, displayMonth)}
            onChange={this.handleMonthYearSelection}
          >
            {
              monthYearOptions.map((option, index) => 
                <option 
                  key={index} 
                  value={option.value}>
                  {option.display}
                </option>)
            }
          </select>
        </div>

        <div id="grid-expense-list">
          <div className="header row-expense">
            <span>Title</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Category</span>
            <span>Notes</span>
          </div>

          <>{ 
            expenses.map(expense => {
              return(
                <div key={expense.id} className="item row-expense">
                  <span>{expense.title}</span>
                  <span>{DateHelper.formatExpenseDate(expense.expenseMonth, expense.expenseDay, expense.expenseYear)}</span>
                  <span>{`$${expense.amount.toFixed(2)}`}</span>
                  <span>{expenseCategories.find(category => expense.category === category.value).display}</span>
                  <span>{expense.notes}</span>
                  <span><button onClick={() => onExpenseDelete(expense.id)}>Delete</button></span>
                </div>           
              );
            })
          }</>
        </div>
      </div>
    );
  }
}