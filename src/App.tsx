import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  BarChart3, 
  Home, 
  FilePlus, 
  FileCheck, 
  DollarSign,
  Percent,
  UserPlus
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import Income from './components/Income';
import Expenses from './components/Expenses';
import Reports from './components/Reports';
import ClientForm from './components/ClientForm';

// Types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  clientId: string;
  hasInvoice: boolean;
  grossAmount: number;
  taxes: number;
  commission: number;
  category: string;
  notes: string;
  type: 'income' | 'expense';
}

function App() {
  // State
  const [clients, setClients] = useState<Client[]>(() => {
    const savedClients = localStorage.getItem('clients');
    return savedClients ? JSON.parse(savedClients) : [];
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Add client
  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient = {
      ...client,
      id: Date.now().toString(),
    };
    setClients([...clients, newClient]);
  };

  // Add transaction
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([...transactions, newTransaction]);
  };

  // Delete client
  const deleteClient = (id: string) => {
    setClients(clients.filter(client => client.id !== id));
  };

  // Delete transaction
  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  // Render active tab content
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} clients={clients} />;
      case 'clients':
        return <ClientList clients={clients} onDelete={deleteClient} />;
      case 'income':
        return (
          <Income 
            transactions={transactions} 
            clients={clients} 
            onAddTransaction={addTransaction} 
            onDeleteTransaction={deleteTransaction}
          />
        );
      case 'expenses':
        return (
          <Expenses 
            transactions={transactions} 
            clients={clients} 
            onAddTransaction={addTransaction} 
            onDeleteTransaction={deleteTransaction}
          />
        );
      case 'reports':
        return <Reports transactions={transactions} clients={clients} />;
      default:
        return <Dashboard transactions={transactions} clients={clients} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800 flex items-center">
            <DollarSign className="mr-2" size={24} />
            FinanceVídeo
          </h1>
        </div>
        <nav className="p-4">
          <ul>
            <li className="mb-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center w-full p-2 rounded ${
                  activeTab === 'dashboard' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="mr-3" size={18} />
                Dashboard
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveTab('clients')}
                className={`flex items-center w-full p-2 rounded ${
                  activeTab === 'clients' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="mr-3" size={18} />
                Clientes
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveTab('income')}
                className={`flex items-center w-full p-2 rounded ${
                  activeTab === 'income' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ArrowDownCircle className="mr-3" size={18} />
                Entradas
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveTab('expenses')}
                className={`flex items-center w-full p-2 rounded ${
                  activeTab === 'expenses' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ArrowUpCircle className="mr-3" size={18} />
                Saídas
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveTab('reports')}
                className={`flex items-center w-full p-2 rounded ${
                  activeTab === 'reports' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="mr-3" size={18} />
                Relatórios
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'clients' && 'Clientes'}
              {activeTab === 'income' && 'Entradas'}
              {activeTab === 'expenses' && 'Saídas'}
              {activeTab === 'reports' && 'Relatórios'}
            </h2>
            <div>
              {activeTab === 'clients' && (
                <button
                  onClick={() => setIsClientFormOpen(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <UserPlus size={18} className="mr-2" />
                  Novo Cliente
                </button>
              )}
            </div>
          </div>
        </header>
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Client Form Modal */}
      {isClientFormOpen && (
        <ClientForm
          onClose={() => setIsClientFormOpen(false)}
          onSave={addClient}
        />
      )}
    </div>
  );
}

export default App;