# 💰 FinanceHub - Professional Finance Dashboard

A comprehensive personal finance management application built with React, Tailwind CSS, and Recharts.

## ✨ Features

### Core Requirements 
- Dashboard Overview with summary cards
- Balance Trend Chart (12-month visualization)
- Spending by Category (Pie chart)
- Complete Transaction Management (CRUD)
- Advanced Filtering & Sorting
- Role-Based Access Control (Viewer/Admin)
- Insights Section with Analytics
- Fully Responsive Design

### Optional Enhancements
- Dark Mode Support
- Data Persistence (LocalStorage)
- Export to CSV & JSON
- Advanced Filtering with Multiple Criteria

### Extra Features 
- Budget Management per Category
- Financial Goals Tracking
- Recurring Transaction Support
- Category Statistics
- Smart Insights Generator
- Budget Alerts & Warnings
- Savings Rate Calculator
- Smooth Animations

**Total: 20 Features Implemented** ✅

## 🛠️ Tech Stack

- **React 19** - UI Framework
- **Vite 8** - Fast Build Tool
- **Tailwind CSS 3** - Styling
- **Zustand 5** - State Management
- **Recharts 3.8** - Data Visualization
- **Lucide React** - Icons

## 🚀 Quick Start
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/finance-dashboard.git
cd finance-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:5173`

## 📊 Dashboard Features

### Overview Tab
- Summary cards (Balance, Income, Expenses, Savings Rate)
- 12-month balance trend chart
- Spending breakdown by category

### Transactions Tab
- View all transactions in table format
- **Search** by merchant/description
- **Filter** by category, type, date range
- **Sort** by date, amount, or category
- **Add** new transactions (Admin only)
- **Edit** existing transactions (Admin only)
- **Delete** transactions (Admin only)
- **Export** to CSV or JSON

### Insights Tab
- Auto-generated financial insights
- Budget status overview
- Top spending categories
- Income vs Expense summary

### Budget Tab
- Set budgets per category
- Track spending progress
- Visual progress bars
- Red alerts for over-budget categories

### Goals Tab
- Create financial goals
- Track progress with visual bars
- Monitor savings targets
- Edit/Delete goals (Admin only)

## 👤 Role-Based Access

### Viewer Mode
-  View all data (read-only)
-  Search & filter transactions
-  View insights & budgets
-  Cannot add/edit/delete data

### Admin Mode
-  Full access to all features
-  Add/Edit/Delete transactions
-  Add/Edit/Delete goals
-  Edit budgets
-  Manage all data

## 💾 Data Management

All data is stored locally in your browser using LocalStorage:
-  Persists across browser sessions
-  No server required
-  Complete privacy
-  Data lost if browser cache is cleared

## 📤 Export Data

Download your transactions in two formats:

- **CSV** - Spreadsheet format (Excel/Google Sheets compatible)
- **JSON** - Complete data backup

## 🌙 Dark Mode

Toggle dark mode using the moon/sun icon in the header. Your preference is automatically saved.

## 📱 Responsive Design

Works seamlessly on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Desktop computers

## 🎯 Project Statistics

| Metric | Value |
|--------|-------|
| Total Components | 11 |
| Total Features | 20 |
| Lines of Code | 6500+ |
| Build Size | 602 KB |
| Gzip Size | 177 KB |
| Load Time | <2 seconds |

## 🚀 Deployment

**Live Demo:** https://finance-dashboard-xxxxx.vercel.app

Deployed on Vercel for instant, automatic deployments.

## 📝 How to Use

### Adding a Transaction
1. Switch to **Admin** mode (top right)
2. Click **"Add Transaction"** button
3. Fill in the form:
   - Date
   - Merchant name
   - Category
   - Type (Income/Expense)
   - Amount
4. Click **"Add Transaction"**

### Filtering Transactions
1. Click **"Filters"** button
2. Select criteria:
   - Category
   - Type
   - Date range
3. Results update automatically

### Exporting Data
1. Click **"CSV"** or **"JSON"** button
2. File downloads to your device
3. Open in Excel, Google Sheets, or text editor

### Setting Budget
1. Go to **Budget** tab
2. Click edit icon on any category
3. Enter budget amount
4. Track spending with visual progress bar

### Creating Goals
1. Go to **Goals** tab (Admin mode)
2. Click **"Add Goal"**
3. Set target amount
4. Track progress automatically.

