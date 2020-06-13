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
            <div>Title</div>
            <div>Date</div>
            <div>Amount</div>
            <div>Category</div>
            <div>Notes</div>
          </div>

          <>{ 
            expenses.map(expense => {
              return(
                <div key={expense.id} className="item row-expense">
                  <div>{expense.title}</div>
                  <div>{DateHelper.formatExpenseDate(expense.expenseMonth, expense.expenseDay, expense.expenseYear)}</div>
                  <div>{`$${expense.amount.toFixed(2)}`}</div>
                  <div>{expenseCategories.find(category => expense.category === category.value).display}</div>
                  <div>
                    <div className="tooltip-group">
                      {expense.notes && <button className="tooltip-toggle">i</button>}
                      <div className="tooltip-data">{expense.notes}</div>
                    </div>
                  </div>
                  <div><button onClick={() => onExpenseDelete(expense)}>Delete</button></div>
                </div>           
              );
            })
          }</>
        </div>
      </div>
    );
  }
}