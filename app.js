let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let myChart;

// Chart initialization
function updateChart() {
  const ctx = document.getElementById('chart').getContext('2d');
  if (myChart) myChart.destroy();

  const incomeCount = transactions.filter(t => t.type === 'income').length;
  const expenseCount = transactions.filter(t => t.type === 'expense').length;

  myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [incomeCount, expenseCount],
        backgroundColor: [
          document.body.classList.contains('dark-mode') ? '#4CAF50' : '#81C784',
          document.body.classList.contains('dark-mode') ? '#ff5252' : '#e57373'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: getComputedStyle(document.body).getPropertyValue('--text-color')
          }
        }
      }
    }
  });
}

// Dark Mode Toggle
document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  updateChart();
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
}

// Core functionality
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateBalance() {
  const balance = transactions.reduce((acc, t) => acc + t.amount, 0);
  document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;
}

function updateSummary() {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
  
  document.getElementById('income').textContent = `$${income.toFixed(2)}`;
  document.getElementById('expense').textContent = `$${Math.abs(expense).toFixed(2)}`;
}

function renderTransactions() {
  const list = document.getElementById('transactions');
  list.innerHTML = '';
  transactions.forEach((t, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${t.description}</span>
      <span style="color: ${t.type === 'income' ? '#4CAF50' : '#ff5252'}">
        $${Math.abs(t.amount).toFixed(2)}
      </span>
      <button onclick="deleteTransaction(${index})">×</button>
    `;
    list.appendChild(li);
  });
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  updateLocalStorage();
  init();
}

document.getElementById('transactionForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const description = document.getElementById('description').value;
  const amount = +document.getElementById('amount').value;
  const type = document.querySelector('input[name="type"]:checked').value;
  
  transactions.push({
    description,
    amount: type === 'income' ? amount : -amount,
    type
  });
  
  updateLocalStorage();
  init();
  e.target.reset();
});

function init() {
  updateBalance();
  updateSummary();
  renderTransactions();
  updateChart();
}

init();