import React from 'react';
import {func, instanceOf, string} from 'prop-types';
import { expenseCategories } from '../utility/category';
import DateHelper from '../utility/dateHelper';

export default class ExpenseForm extends React.Component {
  constructor(props) {
    super(props);
    this.today = DateHelper.getCalendarDateString(this.props.today);
    this.state = this.emptyForm;
  }

  get emptyForm() {
    return {
      title: "",
      expenseDate: this.today,
      amount: "",
      category: "utilities",
      notes: "",
    };
  }

  handleFormSubmit = e => {
    e.preventDefault();
    const {title, expenseDate, amount, category, notes} = this.state;
    const dateParts = DateHelper.getCalendarDateParts(expenseDate);

    const expense = {
      title,
      expenseMonth: dateParts.monthNum,
      expenseYear: dateParts.yearNum,
      expenseDay: dateParts.dayNum,
      amount: +amount,
      category,
      notes
    }
    this.props.onExpenseAdd(expense);
    this.setState(this.emptyForm);
  }
  
  handleFieldInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    const {title, expenseDate, amount, category, notes} = this.state;
    const {minExpenseDate} = this.props;
    return (
      <form id="form-expense" onSubmit={this.handleFormSubmit}>
        <h2>Add Expense</h2>

        {/* Title */}
        <div className="form-group required">
          <label htmlFor="title">Title</label>
          <p className="info-secondary">Max of 40 characters.</p>
          <input 
            name="title"
            id="title"
            className="form-control"
            type="text"
            value={title}
            onChange={this.handleFieldInput}
            required
            maxLength="40"
            placeholder="title"
          />
        </div>

        {/* Expense Date */}
        <div className="form-group required">
          <label htmlFor="expenseDate">Expense Date</label>
          <p className="info-secondary">
            Date between {minExpenseDate} and {this.today} (today).
          </p>
          <input 
            name="expenseDate"
            id="expenseDate"
            className="form-control"
            type="date"
            value={expenseDate}
            onChange={this.handleFieldInput}
            required
            min={minExpenseDate}
            max={this.today}
          />         
        </div>

        {/* Amount */}
        <div className="form-group required">
          <label htmlFor="amount">Amount</label>
          <p className="info-secondary">
            Amount between a penny and $8,000 (which is A LOT!).
          </p>
          <div>
            <span className="currency-symbol">$</span>
            <input 
              name="amount"
              id="amount"
              className="form-control"
              type="number"
              value={amount}
              onChange={this.handleFieldInput}
              required
              min="0.01"
              max="8000"
              step="0.01"
            />
          </div>
        </div>

        {/* Category */}
        <div className="form-group required">
          <label htmlFor="category">Category</label>
          <p className="info-secondary">Expense category.</p>
          <select 
            name="category" 
            id="category" 
            className="form-control"
            value={category}
            onChange={this.handleFieldInput}
            required
          >
            {
              expenseCategories.map((option, index) => 
                <option key={index} value={option.value}>{option.display}</option>)
            }
          </select>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <p className="info-secondary">
            Any additional info or details? Max of 75 characters.
          </p>
          <textarea
            name="notes"
            id="notes" 
            className="form-control"       
            rows="3"
            value={notes}
            onChange={this.handleFieldInput}
            maxLength="75"
            placeholder="notes"
          >
          </textarea>
        </div>

        <button type="submit">Add</button>
      </form>
    );
  }
}

ExpenseForm.propTypes = {
  minExpenseDate: string.isRequired,
  today: instanceOf(Date).isRequired,
  onExpenseAdd: func.isRequired,
};