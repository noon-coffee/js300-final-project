import React from 'react';
import { expenseCategories } from '../data/category';


export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.emptyForm;
    this.minExpenseDate = "2019-12-01";
  }

  get emptyForm() {
    return {
      title: "",
      expenseDate: this.todayString,
      amount: "",
      category: expenseCategories[0].value,
      notes: "",
    };
  }

  get todayString() { 
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0
    const yyyy = today.getFullYear();

    return `${yyyy}-${mm}-${dd}`;
  }

  handleFormSubmit = e => {
    e.preventDefault();
    const {title, expenseDate, amount, category, notes} = this.state;
    const expenseDateParts = expenseDate.split('-');

    const expense = {
      title,
      expenseMonth: +expenseDateParts[1],
      expenseYear: +expenseDateParts[0],
      expenseDay: +expenseDateParts[2],
      amount: +(Number(amount).toFixed(2)),
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
            Date between {this.minExpenseDate} and {this.todayString} (today).
          </p>
          <input 
            name="expenseDate"
            id="expenseDate"
            className="form-control"
            type="date"
            value={expenseDate}
            onChange={this.handleFieldInput}
            required
            min={this.minExpenseDate}
            max={this.todayString}
          />
        </div>

        {/* Amount */}
        <div className="form-group required">
          <label htmlFor="amount">Amount</label>
          <p className="info-secondary">
            Amount between a penny and $8,000 (which is A LOT!).
          </p>
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

        {/* Category */}
        <div className="form-group required">
          <label htmlFor="category">Category</label>
          <p className="info-secondary">Expense category.</p>
          <select 
            name="category" 
            id="category" 
            className="form-control"
            value={category.value}
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
            Any additional info or details?
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