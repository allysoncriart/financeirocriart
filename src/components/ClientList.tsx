import React, { useState } from 'react';
import { Client } from '../App';
import { Search, Trash2, Edit, Mail, Phone } from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  onDelete: (id: string) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = (id: string) => {
    onDelete(id);
    setShowDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Client List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredClients.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <li key={client.id}>
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                      <p className="text-sm text-gray-500">{client.company}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-gray-500"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(client.id)}
                        className="p-2 text-red-400 hover:text-red-500"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <span>{client.email}</span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <span>{client.phone}</span>
                  </div>
                  {client.address && (
                    <div className="mt-2 text-sm text-gray-500">
                      <span>{client.address}</span>
                    </div>
                  )}
                  
                  {/* Delete Confirmation */}
                  {showDeleteConfirm === client.id && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-700 mb-2">
                        Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
                      </p>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={cancelDelete}
                          className="px-3 py-1 text-xs text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => confirmDelete(client.id)}
                          className="px-3 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700"
                        >
                          Confirmar Exclusão
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-4 text-center text-gray-500">
            {clients.length === 0 
              ? "Nenhum cliente cadastrado. Adicione um novo cliente para começar."
              : "Nenhum cliente encontrado com os termos da busca."}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientList;