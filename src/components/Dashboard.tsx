import React from 'react';
import { Client, Transaction } from '../App';
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Users, 
  DollarSign,
  TrendingUp,
  FileCheck,
  FileX
} from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  clients: Client[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, clients }) => {
  // Calculate total income
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate total expenses
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate net profit
  const netProfit = totalIncome - totalExpenses;

  // Calculate invoiced vs non-invoiced income
  const invoicedIncome = transactions
    .filter(t => t.type === 'income' && t.hasInvoice)
    .reduce((sum, t) => sum + t.amount, 0);

  const nonInvoicedIncome = transactions
    .filter(t => t.type === 'income' && !t.hasInvoice)
    .reduce((sum, t) => sum + t.amount, 0);

  // Get recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <ArrowDownCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Entradas Totais</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <ArrowUpCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Saídas Totais</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Lucro Líquido</p>
              <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netProfit)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-800">{clients.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileCheck className="mr-2" size={20} />
            Entradas com Nota Fiscal
          </h3>
          <div className="flex items-center">
            <div className="text-2xl font-bold text-gray-800">{formatCurrency(invoicedIncome)}</div>
            <div className="ml-4 text-sm text-gray-500">
              ({Math.round((invoicedIncome / totalIncome) * 100) || 0}% do total)
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileX className="mr-2" size={20} />
            Entradas sem Nota Fiscal
          </h3>
          <div className="flex items-center">
            <div className="text-2xl font-bold text-gray-800">{formatCurrency(nonInvoicedIncome)}</div>
            <div className="ml-4 text-sm text-gray-500">
              ({Math.round((nonInvoicedIncome / totalIncome) * 100) || 0}% do total)
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Transações Recentes</h3>
        </div>
        <div className="divide-y">
          {recentTransactions.length > 0 ? (
            recentTransactions.map(transaction => {
              const client = clients.find(c => c.id === transaction.clientId);
              return (
                <div key={transaction.id} className="px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      } mr-4`}>
                        {transaction.type === 'income' ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString('pt-BR')} • 
                          {client ? ` ${client.name}` : ' Sem cliente'}
                        </p>
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">
              Nenhuma transação registrada ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;