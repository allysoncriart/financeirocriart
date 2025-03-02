// Main JavaScript file for handling client-side functionality

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the application
  console.log('FinanceVídeo application initialized');

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
          event.preventDefault(); // Evita recarregar a página

          const email = document.getElementById("email").value;
          const password = document.getElementById("password").value;

          // Simulação de usuário válido (pode ser substituído por um backend futuramente)
          const validUser = {
              email: "admin@site.com",
              password: "123456"
          };

          if (email === validUser.email && password === validUser.password) {
              alert("Login realizado com sucesso!");
              localStorage.setItem("usuarioLogado", "true"); // Armazena sessão
              window.location.href = "home.html"; // Redireciona para home
          } else {
              alert("Email ou senha incorretos!");
          }
      });
  }

  // Proteção das páginas
  if (!loginForm && localStorage.getItem("usuarioLogado") !== "true") {
      alert("Você precisa fazer login para acessar esta página.");
      window.location.href = "index.html";
  }
});

// Client Form Functions
function openClientForm() {
  document.getElementById('client-form-modal').classList.remove('hidden');
}

function closeClientForm() {
  document.getElementById('client-form-modal').classList.add('hidden');
}

// Transaction Form Functions
function openTransactionForm(type) {
  const modal = document.getElementById('transaction-form-modal');
  const title = document.getElementById('transaction-form-title');
  const submitBtn = document.getElementById('transaction-submit');
  const transactionType = document.getElementById('transaction-type');
  
  // Set form type
  transactionType.value = type;
  
  // Update UI based on transaction type
  if (type === 'income') {
    title.textContent = 'Nova Entrada';
    submitBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
    submitBtn.classList.add('bg-green-600', 'hover:bg-green-700');
    
    // Show income fields, hide expense fields
    document.querySelectorAll('.income-field').forEach(el => el.classList.remove('hidden'));
    document.querySelectorAll('.expense-field').forEach(el => el.classList.add('hidden'));
    
    // Update client label
    document.getElementById('client-label').textContent = 'Cliente';
  } else {
    title.textContent = 'Nova Saída';
    submitBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
    submitBtn.classList.add('bg-red-600', 'hover:bg-red-700');
    
    // Show expense fields, hide income fields
    document.querySelectorAll('.expense-field').forEach(el => el.classList.remove('hidden'));
    document.querySelectorAll('.income-field').forEach(el => el.classList.add('hidden'));
    
    // Update client label
    document.getElementById('client-label').textContent = 'Fornecedor/Cliente';
  }
  
  modal.classList.remove('hidden');
}

function closeTransactionForm() {
  document.getElementById('transaction-form-modal').classList.add('hidden');
}

// Calculate net amount when gross amount, taxes, or commission changes
function calculateNetAmount() {
  const grossAmount = parseFloat(document.getElementById('transaction-gross').value) || 0;
  const taxes = parseFloat(document.getElementById('transaction-taxes').value) || 0;
  const commission = parseFloat(document.getElementById('transaction-commission').value) || 0;
  
  const netAmount = grossAmount - taxes - commission;
  document.getElementById('transaction-net').value = netAmount > 0 ? netAmount : 0;
}

// Delete confirmation
function showDeleteConfirmation(id, type) {
  const modal = document.getElementById('delete-modal');
  const message = document.getElementById('delete-message');
  
  // Set message based on type
  if (type === 'client') {
    message.textContent = 'Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.';
  } else if (type === 'transaction') {
    message.textContent = 'Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.';
  }
  
  // Store ID and type for confirmation
  modal.dataset.id = id;
  modal.dataset.type = type;
  
  modal.classList.remove('hidden');
}

function cancelDelete() {
  document.getElementById('delete-modal').classList.add('hidden');
}

function confirmDelete() {
  const modal = document.getElementById('delete-modal');
  const id = modal.dataset.id;
  const type = modal.dataset.type;
  
  // Handle deletion based on type
  if (type === 'client') {
    // Delete client logic would go here
    console.log(`Deleting client with ID: ${id}`);
  } else if (type === 'transaction') {
    // Delete transaction logic would go here
    console.log(`Deleting transaction with ID: ${id}`);
  }
  
  modal.classList.add('hidden');
}

// Add event listeners for calculation
if (document.getElementById('transaction-gross')) {
  document.getElementById('transaction-gross').addEventListener('input', calculateNetAmount);
  document.getElementById('transaction-taxes').addEventListener('input', calculateNetAmount);
  document.getElementById('transaction-commission').addEventListener('input', calculateNetAmount);
}
