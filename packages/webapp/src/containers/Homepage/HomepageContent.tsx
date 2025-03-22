// @ts-nocheck
import React from 'react';
import AccountsReceivableSection from './AccountsReceivableSection';
import AccountsPayableSection from './AccountsPayableSection';
import FinancialAccountingSection from './FinancialAccountingSection';
import ProductsServicesSection from './ProductsServicesSection';
import '@/style/pages/HomePage/HomePage.scss';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Area,
  ComposedChart,
  BarChart,
  Bar,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { IncomeExpenseChart } from './components/IncomeExpenseChart';
import { TopSellingChart } from './components/TopSellingChart';
import { InvoiceStatusChart } from './components/InvoiceStatusChart';
import { TopSellingItemsChart } from './components/TopSellingItemsChart';
import { UnpaidInvoicesTable } from './components/UnpaidInvoicesTable';
import { DataSummaryTable } from './components/DataSummaryTable';

function HomepageContent() {
  const incomeData = [
    { month: 'Jan', income: 120000, expense: 90000 },
    { month: 'Feb', income: 78060, expense: 95000 },
    { month: 'Mar', income: 135000, expense: 85000 },
    { month: 'Apr', income: 110000, expense: 130000 },
    { month: 'May', income: 180000, expense: 100000 },
    { month: 'Jun', income: 190000, expense: 85000 },
  ];

  // Calculate totals for the header
  const totalIncome = incomeData.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = incomeData.reduce((sum, item) => sum + item.expense, 0);

  const topSellingData = [
    { name: 'Macbook Pro', value: 400 },
    { name: 'Earcots', value: 370 },
    { name: 'Powerbank', value: 340 },
    { name: 'iPhone 15pro', value: 300 },
    { name: 'Glass Bottle', value: 290 },
    { name: 'Samsung Flip', value: 246 },
    { name: 'Books', value: 230 },
    { name: 'Oraie Speaker', value: 210 },
    { name: 'Sugar', value: 200 },
    { name: 'Dell LED', value: 150 },
  ];

  const invoiceStatusData = [
    { name: 'Unpaid', value: 13, color: '#1248BA' },
    { name: 'Paid', value: 9, color: '#00CB65' },
    { name: 'Draft', value: 4, color: '#7B61FF' },
    { name: 'Returned', value: 1, color: '#E1E1E1' },
  ];

  const topSellingItemsData = [
    { name: 'Macbook Pro (13inch)', value: 568 },
    { name: 'Kids Wear frock', value: 527 },
    { name: 'Power Bank', value: 465 },
    { name: 'Iphone 16 pro Ultra', value: 413 },
    { name: "Men's Professional Suit", value: 349 },
    { name: "Sheesham TV's Stand", value: 321 },
    { name: 'LG Microwave', value: 247 },
    { name: 'Boat Rocker Head Set', value: 236 },
    { name: 'Samsung s39 pro Ultra', value: 167 },
    { name: 'Bosch Washing Machine', value: 98 }
  ];

  const unpaidInvoicesData = [
    { customer: 'Venkat Reddy', value: '20,00,000', overdue: '5ds' },
    { customer: 'Rohit Deshpande', value: '1,245,000', overdue: '4mths' },
    { customer: 'Selvam', value: '810,000', overdue: '1yr' },
    { customer: 'Dinesh Ramghariya', value: '367,000', overdue: '2yrs' },
    { customer: 'Vivek Sharma', value: '10,00,000', overdue: '1yrs' },
    { customer: 'Ankush Gupta', value: '100,000', overdue: '8mths' },
    { customer: 'Karan Madaan', value: '160,000', overdue: '1yr' },
  ];

  const payablesData = [
    { vendor: 'Venkat Reddy', value: 'INR 20,00,000', overdue: '5ds' },
    { vendor: 'Rohit Deshpande', value: 'INR 1,245,000', overdue: '4mths' },
    { vendor: 'Selvam', value: 'INR 810,000', overdue: '1yr' },
    { vendor: 'Dinesh Ramghariya', value: 'INR 367,000', overdue: '2yrs' },
    { vendor: 'Vivek Sharma', value: 'INR 10,00,000', overdue: '1yrs' },
    { vendor: 'Ankush Gupta', value: 'INR 100,000', overdue: '8mths' },
    { vendor: 'Karan Madlain', value: 'INR 160,000', overdue: '1yr' },
  ];

  return (
    <div className="homepage__analytics">
      <div className="analytics__overview">
        <div className="overview__header">
          <h2 className="overview__title">Income and Expense Overview</h2>
          <button className="overview__period-selector">
            Last 6 Months
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="overview__stats">
          <div className="stats__income">
            <div className="stats__icon">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 3V11M7 3L4 6M7 3L10 6"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span>Income: INR {totalIncome.toLocaleString()}</span>
          </div>
          <div className="stats__expense">
            <div className="stats__icon">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 11V3M7 11L4 8M7 11L10 8"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span>Expense: INR {totalExpense.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ width: '100%', height: 300 }}>
          <IncomeExpenseChart data={incomeData} />
        </div>
      </div>

      <div className="analytics__charts">
        <div className="chart__container">
          <TopSellingChart data={topSellingData} />
        </div>
        
        <div className="chart__container">
          <TopSellingItemsChart data={topSellingItemsData} />
        </div>
      </div>

      <div className="analytics__invoices">
        <h2 className="invoices__title">Invoices By Status</h2>
        <div className="invoices__chart-container">
          <div className="chart__wrapper">
            <InvoiceStatusChart data={invoiceStatusData} />
          </div>
          <div className="chart__legend">
            {invoiceStatusData.map((entry, index) => (
              <div key={index} className="legend__item">
                <span
                  className="legend__marker"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="legend__label">{entry.name}</span>
                <span className="legend__value">
                  {entry.value.toString().padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="analytics__tables">
        <DataSummaryTable
          title="Top 5 Unpaid Invoices"
          columns={[
            { key: 'customer', label: 'Customer' },
            { key: 'value', label: 'Value(INR)' },
            { key: 'overdue', label: 'Overdue' }
          ]}
          data={unpaidInvoicesData}
        />

        <DataSummaryTable
          title="Top 5 Payables"
          columns={[
            { key: 'vendor', label: 'Vendor' },
            { key: 'value', label: 'Value' },
            { key: 'overdue', label: 'Overdue' }
          ]}
          data={payablesData}
        />
      </div>
    </div>
  );
}

export default HomepageContent;
