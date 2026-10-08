// Get DOM Elements
const balanceDisplay = document.getElementById('balance');
const incomeDisplay = document.getElementById('income-total');
const expenseDisplay = document.getElementById('expense-total');
const list = document.getElementById('list');
const form = document.getElementById('transaction-form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');

// Get transactions from local storage
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// 1. Add Transaction
function addTransaction(e) {
    e.preventDefault();

    if (textInput.value.trim() === '' || amountInput.value.trim() === '') {
        alert('Please add a text and amount');
        return;
    }

    const transaction = {
        id: generateID(),
        text: textInput.value,
        amount: parseFloat(amountInput.value),
        type: typeInput.value // 'income' or 'expense'
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    // Clear inputs
    textInput.value = '';
    amountInput.value = '';
}

// 2. Generate Random ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// 3. Add Transaction to DOM (The UI list)
function addTransactionDOM(transaction) {
    const li = document.createElement('li');

    // Add CSS class based on type (adds green or red border)
    li.classList.add(transaction.type);

    // Format the sign (+ or -)
    const sign = transaction.type === 'income' ? '+' : '-';

    li.innerHTML = `
        <span>${transaction.text}</span> 
        <span>${sign}$${transaction.amount.toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">Delete</button>
    `;

    list.appendChild(li);
}

// 4. Update Balance, Income, and Expense numbers
function updateValues() {
    let totalIncome = 0;
    let totalExpense = 0;

    // Calculate totals
    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
        } else if (transaction.type === 'expense') {
            totalExpense += transaction.amount;
        }
    });

    const totalBalance = totalIncome - totalExpense;

    // Update the HTML
    balanceDisplay.innerText = `$${totalBalance.toFixed(2)}`;
    incomeDisplay.innerText = `+$${totalIncome.toFixed(2)}`;
    expenseDisplay.innerText = `-$${totalExpense.toFixed(2)}`;
}

// 5. Remove a transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    
    updateLocalStorage();
    init(); // Restart to refresh UI
}

// 6. Save to Local Storage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// 7. Initialize App
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

// Start
init();

// Event Listener
form.addEventListener('submit', addTransaction);
