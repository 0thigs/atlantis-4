import React, { useState, useMemo } from 'react';
import { PlusCircle, Edit, Trash2, X, Search, Filter, Eye, Users, DollarSign } from 'lucide-react';
import { Room } from '../types';
import ConfirmationModal from '../components/ConfirmationModal';
import { useHotelData } from '../hooks/useHotelData';

const Rooms = () => {
  const { rooms, addRoom, updateRoom, deleteRoom } = useHotelData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [viewingRoom, setViewingRoom] = useState<Room | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [formData, setFormData] = useState<Omit<Room, 'id'>>({
    number: '',
    type: 'standard',
    price: 0,
    capacity: 1,
    description: '',
    status: 'available'
  });

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = searchTerm === '' ||
        room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === '' || room.type === typeFilter;
      const matchesStatus = statusFilter === '' || room.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [rooms, searchTerm, typeFilter, statusFilter]);

  const stats = useMemo(() => {
    const available = rooms.filter(r => r.status === 'available').length;
    const occupied = rooms.filter(r => r.status === 'occupied').length;
    const maintenance = rooms.filter(r => r.status === 'maintenance').length;
    const avgPrice = rooms.length > 0 ? rooms.reduce((sum, r) => sum + r.price, 0) / rooms.length : 0;

    return { available, occupied, maintenance, avgPrice };
  }, [rooms]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'capacity' ? Number(value) : value
    }));
  };

  const resetForm = () => {
    setFormData({
      number: '',
      type: 'standard',
      price: 0,
      capacity: 1,
      description: '',
      status: 'available'
    });
    setEditingRoom(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      updateRoom(editingRoom.id, formData);
    } else {
      addRoom({ ...formData, id: String(Date.now()) });
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      number: room.number,
      type: room.type,
      price: room.price,
      capacity: room.capacity,
      description: room.description,
      status: room.status
    });
    setIsModalOpen(true);
  };

  const handleView = (room: Room) => {
    setViewingRoom(room);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (room: Room) => {
    setDeletingRoom(room);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingRoom) {
      deleteRoom(deletingRoom.id);
      setDeletingRoom(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setStatusFilter('');
    setIsFilterOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Gestão de Quartos</h1>
          <p className="text-gray-600">Gerencie quartos do hotel e sua disponibilidade</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex gap-2 justify-center items-center px-4 py-2 w-full text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 sm:w-auto"
        >
          <PlusCircle className="w-5 h-5" />
          Adicionar Novo Quarto
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Disponíveis</p>
              <p className="text-xl font-bold text-green-600 sm:text-2xl">{stats.available}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Ocupados</p>
              <p className="text-xl font-bold text-red-600 sm:text-2xl">{stats.occupied}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Manutenção</p>
              <p className="text-xl font-bold text-yellow-600 sm:text-2xl">{stats.maintenance}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Preço Médio</p>
              <p className="text-xl font-bold text-blue-600 sm:text-2xl">R${Math.round(stats.avgPrice)}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign className="w-4 h-4 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar quartos por número, tipo ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${isFilterOpen || typeFilter || statusFilter
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filtros</span>
              {(typeFilter || statusFilter) && <span className="px-2 py-1 text-xs text-white bg-blue-600 rounded-full">{[typeFilter, statusFilter].filter(Boolean).length}</span>}
            </button>
            {(searchTerm || typeFilter || statusFilter) && (
              <button
                onClick={clearFilters}
                className="hidden px-4 py-2 text-gray-600 hover:text-gray-800 sm:block"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {isFilterOpen && (
          <div className="pt-4 mt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Tipo de Quarto
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos os Tipos</option>
                  <option value="standard">Standard</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suíte</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos os Status</option>
                  <option value="available">Disponível</option>
                  <option value="occupied">Ocupado</option>
                  <option value="maintenance">Manutenção</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:justify-between sm:items-center">
        <span>
          Mostrando {filteredRooms.length} de {rooms.length} quartos
          {searchTerm && ` correspondendo a "${searchTerm}"`}
          {typeFilter && ` do tipo "${getTypeLabel(typeFilter)}"`}
          {statusFilter && ` com status "${statusFilter}"`}
        </span>
        {(searchTerm || typeFilter || statusFilter) && (
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-800 sm:hidden"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow-md transition-shadow hover:shadow-lg">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:justify-between sm:items-start">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 sm:text-xl">Quarto {room.number}</h3>
                  <p className="text-gray-600">{getTypeLabel(room.type)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border flex-shrink-0 ${getStatusColor(room.status)}`}>
                  {room.status === 'available' ? 'Disponível' :
                    room.status === 'occupied' ? 'Ocupado' :
                      room.status === 'maintenance' ? 'Manutenção' : room.status}
                </span>
              </div>

              <p className="mb-4 text-gray-700 line-clamp-2">{room.description}</p>

              <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:justify-between sm:items-center">
                <div className="flex gap-4 items-center">
                  <div className="flex gap-1 items-center text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{room.capacity} hóspedes</span>
                  </div>
                </div>
                <div className="flex gap-1 items-center text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-lg font-bold text-gray-900">R${room.price}</span>
                  <span className="text-sm text-gray-600">/noite</span>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handleView(room)}
                  className="p-2 text-gray-600 rounded-md transition-colors hover:text-gray-800 hover:bg-gray-100"
                  title="Ver Detalhes"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(room)}
                  className="p-2 text-blue-600 rounded-md transition-colors hover:text-blue-800 hover:bg-blue-100"
                  title="Editar Quarto"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteClick(room)}
                  className="p-2 text-red-600 rounded-md transition-colors hover:text-red-800 hover:bg-red-100"
                  title="Excluir Quarto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="py-12 text-center">
          <div className="text-gray-500">
            {searchTerm || typeFilter || statusFilter ? 'Nenhum quarto corresponde aos seus critérios de busca.' : 'Nenhum quarto encontrado.'}
          </div>
          {(searchTerm || typeFilter || statusFilter) && (
            <button
              onClick={clearFilters}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {editingRoom ? 'Editar Quarto' : 'Adicionar Novo Quarto'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Número do Quarto *
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      required
                      className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Tipo de Quarto *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="standard">Standard</option>
                      <option value="deluxe">Deluxe</option>
                      <option value="suite">Suíte</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Preço por Noite *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Capacidade *
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      required
                      min="1"
                      max="10"
                      className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="available">Disponível</option>
                      <option value="occupied">Ocupado</option>
                      <option value="maintenance">Manutenção</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Descrição
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 justify-end pt-6 border-t border-gray-200 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="order-2 px-6 py-2 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 sm:order-1"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="order-1 px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 sm:order-2"
                  >
                    {editingRoom ? 'Atualizar Quarto' : 'Adicionar Quarto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isDetailModalOpen && viewingRoom && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl bg-white rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detalhes do Quarto</h2>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Número do Quarto</label>
                    <p className="text-lg font-semibold text-gray-900">{viewingRoom.number}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Tipo</label>
                    <p className="text-gray-900">{getTypeLabel(viewingRoom.type)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Capacidade</label>
                    <div className="flex gap-2 items-center">
                      <Users className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{viewingRoom.capacity} hóspedes</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Preço por Noite</label>
                    <div className="flex gap-2 items-center">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <p className="text-2xl font-bold text-green-600">R${viewingRoom.price}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(viewingRoom.status)}`}>
                      {viewingRoom.status === 'available' ? 'Disponível' :
                        viewingRoom.status === 'occupied' ? 'Ocupado' :
                          viewingRoom.status === 'maintenance' ? 'Manutenção' : viewingRoom.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-medium text-gray-500">Descrição</label>
                <p className="mt-1 text-gray-900">{viewingRoom.description}</p>
              </div>

              <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleEdit(viewingRoom);
                  }}
                  className="flex gap-2 items-center px-4 py-2 text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4" />
                  Editar Quarto
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 text-gray-700 rounded-md border border-gray-300 transition-colors hover:bg-gray-50"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Quarto"
        message={`Tem certeza de que deseja excluir o <strong>Quarto ${deletingRoom?.number}</strong>? Esta ação não pode ser desfeita e afetará todas as reservas associadas.`}
        confirmText="Excluir Quarto"
        type="danger"
        icon={<Trash2 className="w-5 h-5" />}
      />
    </div>
  );
};

export default Rooms;