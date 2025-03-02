import React, { useState } from 'react';
import { Client, Transaction } from '../App';
import { 
  BarChart3, 
  PieChart, 
  Calendar, 
  Download,
  FileCheck,
  FileX,
  ArrowDownCircle,
  ArrowUpCircle
} from 'lucide-react';

interface ReportsProps {
  transactions: Transaction[];
  clients: Client[];
}

const Reports: React.FC<ReportsProps> = ({ transactions, clients }) => {
  const [period, setPeriod] = useState('month');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Filter transactions by date range
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the end date fully
    
    return transactionDate >= start && transactionDate <= end;
  });

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  const totalTaxes = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.taxes, 0);

  const totalCommission = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.commission, 0);

  const invoicedIncome = filteredTransactions
    .filter(t => t.type === 'income' && t.hasInvoice)
    .reduce((sum, t) => sum + t.amount, 0);

  const nonInvoicedIncome = filteredTransactions
    .filter(t => t.type === 'income' && !t.hasInvoice)
    .reduce((sum, t) => sum + t.amount, 0);

  // Group expenses by category
  const expensesByCategory = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const { category, amount } = transaction;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += amount;
      return acc;
    }, {} as Record<string, number>);

  // Group income by client
  const incomeByClient = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, transaction) => {
      const { clientId, amount } = transaction;
      if (!acc[clientId]) {
        acc[clientId] = 0;
      }
      acc[clientId] += amount;
      return acc;
    }, {} as Record<string, number>);

  // Handle period change
  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    
    const today = new Date();
    let start = new Date();
    
    switch (newPeriod) {
      case 'week':
        start.setDate(today.getDate() - 7);
        break;
      case 'month':
        start.setMonth(today.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(today.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(today.getFullYear() - 1);
        break;
      default:
        start.setMonth(today.getMonth() - 1);
    }
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  };

  // Export report as CSV
  const exportCSV = () => {
    // Headers
    let csv = 'Data,Tipo,Descrição,Cliente,Nota Fiscal,Valor Bruto,Impostos,Comissão,Valor Líquido,Categoria\n';
    
    // Add rows
    filteredTransactions.forEach(t => {
      const client = clients.find(c => c.id === t.clientId);
      const row = [
        new Date(t.date).toLocaleDateString('pt-BR'),
        t.type === 'income' ? 'Entrada' : 'Saída',
        `"${t.description.replace(/"/g, '""')}"`,
        client ? `"${client.name.replace(/"/g, '""')}"` : '',
        t.hasInvoice ? 'Sim' : 'Não',
        t.grossAmount.toFixed(2).replace('.', ','),
        t.taxes.toFixed(2).replace('.', ','),
        t.commission.toFixed(2).replace('.', ','),
        t.amount.toFixed(2).replace('.', ','),
        t.category
      ].join(',');
      
      csv += row + '\n';
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_financeiro_${startDate}_a_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold mb-2">Período do Relatório</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePeriodChange('week')}
                className={`px-3 py-1 rounded text-sm ${
                  period === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => handlePeriodChange('month')}
                className={`px-3 py-1 rounded text-sm ${
                  period === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Mês
              </button>
              <button
                onClick={() => handlePeriodChange('quarter')}
                className={`px-3 py-1 rounded text-sm ${
                  period === 'quarter' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Trimestre
              </button>
              <button
                onClick={() => handlePeriodChange('year')}
                className={`px-3 py-1 rounded text-sm ${
                  period === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Ano
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Data Inicial
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Data Final
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          <button
            onClick={exportCSV}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Download size={18} className="mr-2" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <ArrowDownCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Entradas</p>
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
              <p className="text-sm text-gray-500 font-medium">Saídas</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <BarChart3 size={24} />
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
              <PieChart size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Margem de Lucro</p>
              <p className="text-2xl font-bold text-gray-800">
                {totalIncome > 0 ? `${Math.round((netProfit / totalIncome) * 100)}%` : '0%'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoice Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Status de Notas Fiscais</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <FileCheck size={20} className="text-green-500 mr-2" />
                <span>Com Nota Fiscal</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold">{formatCurrency(invoicedIncome)}</span>
                <span className="ml-2 text-sm text-gray-500">
                  ({totalIncome > 0 ? Math.round((invoicedIncome / totalIncome) * 100) : 0}%)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${totalIncome > 0 ? (invoicedIncome / totalIncome) * 100 : 0}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center">
                <FileX size={20} className="text-red-500 mr-2" />
                <span>Sem Nota Fiscal</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold">{formatCurrency(nonInvoicedIncome)}</span>
                <span className="ml-2 text-sm text-gray-500">
                  ({totalIncome > 0 ? Math.round((nonInvoicedIncome / totalIncome) * 100) : 0}%)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-red-500 h-2.5 rounded-full" 
                style={{ width: `${totalIncome > 0 ? (nonInvoicedIncome / totalIncome) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Deduções</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Impostos</span>
                <span className="font-semibold">{formatCurrency(totalTaxes)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-yellow-500 h-2.5 rounded-full" 
                  style={{ width: `${totalIncome > 0 ? (totalTaxes / totalIncome) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">
                {totalIncome > 0 ? Math.round((totalTaxes / totalIncome) * 100) : 0}% da receita bruta
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>Comissões</span>
                <span className="font-semibold">{formatCurrency(totalCommission)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-500 h-2.5 rounded-full" 
                  style={{ width: `${totalIncome > 0 ? (totalCommission / totalIncome) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">
                {totalIncome > 0 ? Math.round((totalCommission / totalIncome) * 100) : 0}% da receita bruta
              </div>
            </div>
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Despesas por Categoria</h3>
          {Object.keys(expensesByCategory).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(expensesByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span>{category}</span>
                      <span className="font-semibold">{formatCurrency(amount)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-500 h-2.5 rounded-full" 
                        style={{ width: `${totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0}% do total
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhuma despesa no período selecionado.</p>
          )}
        </div>

        {/* Income by Client */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Receita por Cliente</h3>
          {Object.keys(incomeByClient).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(incomeByClient)
                .sort(([, a], [, b]) => b - a)
                .map(([clientId, amount]) => {
                  const client = clients.find(c => c.id === clientId);
                  return (
                    <div key={clientId}>
                      <div className="flex justify-between mb-1">
                        <span>{client ? client.name : 'Cliente Desconhecido'}</span>
                        <span className="font-semibold">{formatCurrency(amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-500 h-2.5 rounded-full" 
                          style={{ width: `${totalIncome > 0 ? (amount / totalIncome) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-gray-500 mt-1">
                        {totalIncome > 0 ? Math.round((amount / totalIncome) * 100) : 0}% do total
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhuma receita no período selecionado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;