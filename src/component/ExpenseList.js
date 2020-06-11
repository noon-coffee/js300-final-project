import React from 'react';


export default class ExpenseList extends React.Component {
  formatExpenseDate = (month, day, year) => 
    `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;
  formatYearMonth = (year, month) => `${year}-${month}`;

  handleFieldInput = e => {
    const yearMonthParts = e.target.value.split('-')
    const year = +yearMonthParts[0];
    const month = +yearMonthParts[1];
    this.props.onMonthYearChange(year, month);
  }

  render() {
    const {expenses, displayMonth, displayYear, monthYearOptions, onExpenseDelete} = this.props;

    return(
      <div className="container-section">
        <h2>Expense List</h2>

        <div>
          <select 
            name="monthYear" 
            id="monthYear" 
            value={this.formatYearMonth(displayYear, displayMonth)}
            onChange={this.handleFieldInput}
          >
            {
              monthYearOptions.map((option, index) => 
                <option 
                  key={index} 
                  value={this.formatYearMonth(option.expenseYear, option.expenseMonth)}>
                  {this.formatYearMonth(option.expenseYear, option.expenseMonth)}
                </option>)
            }
          </select>
        </div>

        <div id="grid-expenses">
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
                  <span>{this.formatExpenseDate(expense.expenseMonth, expense.expenseDay, expense.expenseYear)}</span>
                  <span>{`$${expense.amount}`}</span>
                  <span>{expense.category}</span>
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