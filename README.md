# 💰 Coinflow - Expense Tracker Application

A modern, full-stack expense tracking application built with **React** and **Node.js** that helps individuals and groups manage their finances efficiently.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-%23323330.svg?style=flat&logo=react&logoColor=%2361DAFB)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat&logo=mongodb&logoColor=white)

---

## 🌟 Features

### 👤 Personal Finance Management
- **Expense Tracking**: Add, edit, and delete expenses with detailed information
- **Income Tracking**: Record multiple income sources (freelance, salary, investments, etc.)
- **Smart Categorization**: Organized expense categories with emoji icons (🍽️ Food, 🚗 Transport, 🎓 Education, etc.)
- **Budget Management**: Set and monitor spending budgets
- **AI-Powered Insights**: Get intelligent spending recommendations and patterns

### 👥 Group Expense Management
- **Create Groups**: Invite friends and family to manage shared expenses
- **Smart Splitting**: Split expenses equally, by percentage, or custom amounts
- **Expense Settlement**: Automatic calculation of who owes whom
- **PDF Reports**: Generate comprehensive expense reports for groups
- **Real-time Updates**: Live synchronization of group expenses

### 📊 Analytics & Reporting
- **Spending Trends**: Visualize monthly spending patterns
- **Category Breakdown**: Analyze spending by category
- **Day-wise Patterns**: See spending behavior by day of week
- **Advanced Charts**: Interactive graphs and progress bars
- **Export Reports**: Generate detailed PDF reports

### 🎨 User Experience
- **Dark/Light Themes**: Choose your preferred theme
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Real-time Filtering**: Filter by date, amount, and category
- **Smooth Animations**: Beautiful transitions and hover effects
- **Glassmorphism Design**: Modern UI with backdrop blur effects

### 🔐 Security & Authentication
- **User Authentication**: Secure login and registration
- **Role-Based Access**: Admin and member roles for groups
- **Data Encryption**: Secure data transmission
- **Session Management**: Automatic session handling

---

## 🛠️ Tech Stack

### Frontend
- **React 18**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js/Recharts**: Data visualization
- **jsPDF**: PDF generation
- **Axios**: HTTP client

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **JWT**: Authentication
- **Nodemailer**: Email notifications

### DevOps
- **Git**: Version control
- **npm/yarn**: Package management
- **Docker**: Containerization (optional)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/AslamEl/expense_tracker_coinflow_fullsatck_MERN.git
cd expense-tracker
```

2. **Setup Backend**
```bash
cd backend
npm install

# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/expense-tracker" > .env
echo "JWT_SECRET=your_secret_key" >> .env
echo "PORT=5000" >> .env

# Start backend server
npm start
```

3. **Setup Frontend**
```bash
cd frontend
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start frontend development server
npm start
```

The application will be available at `http://localhost:3000`

---

## 📋 Project Structure

```
expense-tracker/
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/           # Route handlers
│   │   ├── expenseController.js
│   │   ├── groupController.js
│   │   ├── incomeController.js
│   │   └── authController.js
│   ├── middleware/            # Custom middleware
│   │   └── auth.js
│   ├── models/                # Database schemas
│   │   ├── Expense.js
│   │   ├── Group.js
│   │   ├── Income.js
│   │   └── User.js
│   ├── routes/                # API endpoints
│   │   ├── auth.js
│   │   ├── expenses.js
│   │   ├── groups.js
│   │   └── incomes.js
│   ├── services/              # Business logic
│   │   ├── emailService.js
│   │   ├── expenseCalculator.js
│   │   ├── pdfService.js
│   │   └── settlementService.js
│   └── server.js              # Entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── ExpenseForm.js
│   │   │   ├── ExpenseList.js
│   │   │   ├── ExpenseAnalytics.js
│   │   │   ├── ExpenseSummary.js
│   │   │   ├── Groups.js
│   │   │   ├── GroupDetails.js
│   │   │   ├── Header.js
│   │   │   └── ... (more components)
│   │   ├── contexts/          # React Context
│   │   │   ├── AuthContext.js
│   │   │   └── ThemeContext.js
│   │   ├── utils/             # Utilities
│   │   │   ├── svgIcons.js
│   │   │   ├── generateGroupPDF.js
│   │   │   └── ExpenseAI.js
│   │   ├── App.js
│   │   └── index.js
│   └── tailwind.config.js
│
├── .gitignore
├── README.md
└── package.json
```

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Income
- `GET /api/incomes` - Get all incomes
- `POST /api/incomes` - Create new income
- `PUT /api/incomes/:id` - Update income
- `DELETE /api/incomes/:id` - Delete income

### Groups
- `GET /api/groups` - Get user's groups
- `POST /api/groups` - Create new group
- `GET /api/groups/:id` - Get group details
- `POST /api/groups/:id/expenses` - Add group expense
- `POST /api/groups/:id/settle` - Settle group balances

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Before You Start
1. Fork the repository
2. Create a new branch: `git checkout -b feature/amazing-feature`
3. Make sure you have Node.js installed

### Development Workflow

1. **Make Your Changes**
   - Follow the existing code style
   - Write clear, descriptive commit messages
   - Test your changes locally

2. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

3. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

4. **Create a Pull Request**
   - Describe what your changes do
   - Reference any related issues
   - Ensure all tests pass

### Coding Guidelines

- **Code Style**: Use consistent indentation (2 spaces)
- **Naming**: Use camelCase for variables/functions, PascalCase for components
- **Comments**: Add comments for complex logic
- **Testing**: Write tests for new features
- **Documentation**: Update README if you add new features

### Commit Message Format

```
feat: add new feature
fix: fix a bug
docs: update documentation
style: code style changes
refactor: refactor code
test: add tests
chore: update dependencies
```

### Reporting Issues

If you find a bug, please create an issue with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

---

## 📱 Responsive Design

The application is fully responsive and works perfectly on:
- ✅ Mobile devices (320px and up)
- ✅ Tablets (768px and up)
- ✅ Desktops (1024px and up)
- ✅ Large screens (1280px and up)

---

## 🎨 Customization

### Theme Customization
Modify `tailwind.config.js` to change colors and styles:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    }
  }
}
```

### Currency Customization
Change default currency in:
- Frontend: User settings
- Backend: `.env` file

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Support

If you like this project, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🤝 Contributing code

---

## 👥 Team

- **Aslam El** - Project Lead & Developer
  - GitHub: [github.com/AslamEl](https://github.com/AslamEl)
  - LinkedIn: [linkedin.com/in/iamaslam](https://www.linkedin.com/in/iamaslam/)
  - Email: [mhdroman171@gmail.com](mailto:mhdroman171@gmail.com)


---

## 📞 Contact & Support

- 📧 Email: [mhdroman171@gmail.com](mailto:mhdroman171@gmail.com)
- 🌐 GitHub: [github.com/AslamEl](https://github.com/AslamEl)
- 💼 LinkedIn: [linkedin.com/in/iamaslam](https://www.linkedin.com/in/iamaslam/)
- � Repository: [expense_tracker_coinflow_fullsatck_MERN](https://github.com/AslamEl/expense_tracker_coinflow_fullsatck_MERN.git)


---

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced budget alerts
- [ ] Recurring expense automation
- [ ] Multi-currency support
- [ ] Dark mode enhancement
- [ ] Export to CSV/Excel
- [ ] Integration with banking APIs
- [ ] Machine learning for spending predictions

---

## 🙌 Acknowledgments

- React community
- Tailwind CSS
- MongoDB
- All our contributors

---

**Made with ❤️ by the Coinflow Team**
