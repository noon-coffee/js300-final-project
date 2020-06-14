import React from 'react';
import {array} from 'prop-types';
import {expenseCategories} from '../utility/category';

export default class Metrics extends React.Component {
  computeActualSpending(expenses) {
    const actualSpending = expenses.reduce((accum, item) => accum + item.amount, 0);
    return actualSpending;
  }

  computeMetrics = (expenses) => {
    let metrics = [];
    expenseCategories.forEach(category => {
      const matchingExpenses = expenses.filter(expense => expense.category === category.value);
      const actual = this.computeActualSpending(matchingExpenses);
      const budget = category.monthlyBudget;
      metrics.push({
        category: category.display,
        budget,
        actual,
      })
    });
    return metrics;
  }

  render() {
    const {expenses} = this.props;
    const metrics = this.computeMetrics(expenses);

    return(
      <div className="container-section">
        <h2>Metrics</h2>
        <div className="container-metrics"> {
          metrics.map((metric, index) => {
            return(
              <div key={index} className="grid-metric">
                <div 
                  className={`health-indicator ${metric.actual > metric.budget ? 'unhealthy' : 'healthy'}`}>
                </div>
                <div className="header">{metric.category}</div>
                <div className="budget title">
                  <span className="title">Budget</span>
                </div>
                <div className="budget amount">
                  <span className="amount">${Number(metric.budget).toFixed(2)}</span>
                </div>
                <div className="actual title">
                  <span className="title">Actual</span>
                </div>
                <div className="actual amount">
                  <span className="amount">${Number(metric.actual).toFixed(2)}</span>
                </div>
              </div>
            );
          })
        } </div>
      </div>
    );
  }
}

Metrics.propTypes = {
  expenses: array.isRequired,
};