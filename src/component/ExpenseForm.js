import React from 'react';
import { expenseCategories } from '../data/category';


export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.emptyForm;
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
      <section>
        <h2>Add Expense</h2>

        <form id="form-expense" onSubmit={this.handleFormSubmit}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input 
              name="title"
              id="title"
              type="text"
              value={title}
              onChange={this.handleFieldInput}
              required
              maxLength="40"
              placeholder="expense title (maximum of 40 characters)"
            />
          </div>

          {/* Expense Date */}
          <div className="form-group">
            <label htmlFor="expenseDate">Expense Date</label>
            <input 
              name="expenseDate"
              id="expenseDate"
              type="date"
              value={expenseDate}
              onChange={this.handleFieldInput}
              required
              min="2019-12-01"
              max={this.todayString}
            />
          </div>

          {/* Amount */}
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input 
              name="amount"
              id="amount"
              type="number"
              value={amount}
              onChange={this.handleFieldInput}
              required
              min="0.01"
              max="8000"
              step="0.01"
              placeholder="expense amount"
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select 
              name="category" 
              id="category" 
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
            <textarea
              name="notes"
              id="notes"        
              rows="5"
              value={notes}
              onChange={this.handleFieldInput}
              maxLength="75"
              placeholder="add a note here"
            >
            </textarea>
          </div>

          <button type="submit">Add</button>
        </form>
      </section>
    );
  }
}