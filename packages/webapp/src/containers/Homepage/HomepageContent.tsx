// @ts-nocheck
import React, { useEffect, useState } from 'react';
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
import { useQuery } from 'react-query';
import { useDashboardAnalytics } from '@/services/dashboard';
import { Spinner } from '@blueprintjs/core';

function HomepageContent() {

  const { data, isLoading, error } = useDashboardAnalytics();
  
  // Add detailed logging to see the exact API response
  console.log('[HomepageContent] Full API Response:', data);
  console.log('[HomepageContent] Response Type:', typeof data);
  console.log('[HomepageContent] Response Keys:', data ? Object.keys(data) : 'No data');
  
  // Extract the actual data from the response
  const analyticsData = data?.analytics_dashboard_data || data;
  console.log('[HomepageContent] Analytics Data:', analyticsData);

  if (isLoading) {
    return (
      <div className="homepage__loading">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="homepage__error">
        Error loading dashboard data: {error.message}
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="homepage__error">
        No dashboard data available
      </div>
    );
  }

  // Format the data for charts and tables
  const incomeData = analyticsData?.income_expense_overview || [];

  // Calculate totals for the header
  const totalIncome = incomeData.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = incomeData.reduce((sum, item) => sum + item.expense, 0);

  // Format top selling items data
  const topSellingItemsData = (analyticsData?.top_selling_items || []).map(item => ({
    name: item.name,
    value: item.quantity
  }));

  // Format invoice status data with colors
  const statusColors = {
    'draft': '#7B61FF',
    'paid': '#00CB65',
    'unpaid': '#1248BA',
    'partially-paid': '#FFA500',
    'overdue': '#FF0000',
    'delivered': '#E1E1E1'
  };

  const invoiceStatusData = (analyticsData?.invoice_statuses || []).map(status => ({
    name: status.status,
    value: parseInt(status.count),
    color: statusColors[status.status] || '#E1E1E1'
  }));

  // Format unpaid invoices data
  const unpaidInvoicesData = (analyticsData?.top_unpaid_invoices || []).map(invoice => ({
    customer: invoice.customer_name,
    value: invoice.due_amount.toLocaleString('en-IN'),
    overdue: getOverdueDays(invoice.due_date)
  }));

  // Format cash and bank balances data
  const cashBankBalancesData = (analyticsData?.cash_and_bank_balances || []).map(account => ({
    account: account.account_name,
    value: (account.balance || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }));

  // const recentActivitiesData = [
  //   { type: 'updated', user: 'You', reference: 'INV08/077', details: 'for 1001.0 with cash in hand.', time: '11:40pm' },
  //   { type: 'generated', user: 'You', reference: 'Instamojo payment link', customer: 'Aman Verma', amount: '257.64', time: '10:14am' },
  //   { type: 'requested', user: 'Aman Gupta', details: 'to release the INV/211 for project "UI/UX Design for mobile App"', time: 'Yesterday' },
  //   { type: 'added', user: 'You', reference: 'INV/211', customer: 'customer', amount: '0.00', time: '1d ago' },
  //   { type: 'added', user: 'You', reference: 'INV/211', customer: 'customer', amount: '0.00', time: '1d ago' },
  // ];

  return (
    <div className="homepage__analytics" style={{ backgroundColor: '#f8f7f7' }}>
      <div className="dashboard__main-content">
        {/* Left column */}
        <div className="dashboard__left-column">
          {/* Income and Expense Overview */}
          <div className="analytics__overview">
            <div className="overview__header">
              <h2 className="overview__title">Income and Expense Overview</h2>
              <div>
                Last 6 Months
              </div>
              {/* <button className="overview__period-selector">
                Last 6 Months
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button> */}
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
                <span>Income: INR {totalIncome.toLocaleString('en-IN')}</span>
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
                <span>Expense: INR {totalExpense.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ width: '100%', height: 300 }}>
              <IncomeExpenseChart data={incomeData} />
            </div>
          </div>

          {/* Top 10 Selling Items */}
          <div className="chart__container">
            <TopSellingItemsChart data={topSellingItemsData} />
          </div>
        </div>

        {/* Right column */}
        <div className="dashboard__right-column">

         

          {/* Invoices By Status */}
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
        </div>

        
      </div>

      {/* Tables section - full width */}
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
          title="Cash and Bank Balances"
          columns={[
            { key: 'account', label: 'Account' },
            { 
              key: 'value', 
              label: 'Value(INR)',
              render: (value) => (
                <span className={parseFloat(value.replace(/,/g, '')) < 0 ? 'negative-value' : ''}>
                  {value}
                </span>
              )
            }
          ]}
          data={cashBankBalancesData}
        />
      </div>
    </div>
  );
}

// Helper function to calculate overdue days/months/years
function getOverdueDays(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = Math.abs(now - due);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays}ds`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months}mths`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years}${years === 1 ? 'yr' : 'yrs'}`;
  }
}

export default HomepageContent;
