import React, { useState } from 'react';
import { Home, Search, X, Users, DollarSign } from 'lucide-react';
import { Room } from '../types';

interface RoomSelectorProps {
  rooms: Room[];
  selectedRoom: Room | null;
  onSelectRoom: (room: Room | null) => void;
  onClose: () => void;
  minCapacity?: number;
}

const RoomSelector: React.FC<RoomSelectorProps> = ({
  rooms,
  selectedRoom,
  onSelectRoom,
  onClose,
  minCapacity = 1
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'standard' | 'deluxe' | 'suite'>('all');

  const availableRooms = rooms.filter(room =>
    room.status === 'available' && room.capacity >= minCapacity
  );

  const filteredRooms = availableRooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || room.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'deluxe': return 'bg-purple-100 text-purple-800';
      case 'suite': return 'bg-gold-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    return Home;
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'standard': return 'Standard';
      case 'deluxe': return 'Deluxe';
      case 'suite': return 'Suíte';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Selecionar Quarto</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por número do quarto ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
            >
              <option value="all">Todos os Tipos</option>
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suíte</option>
            </select>
          </div>

          {minCapacity > 1 && (
            <p className="p-2 text-sm text-blue-600 bg-blue-50 rounded">
              Mostrando apenas quartos com capacidade para {minCapacity}+ hóspedes
            </p>
          )}
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh]">
          {filteredRooms.length === 0 ? (
            <div className="py-8 text-center">
              <Home className="mx-auto mb-4 w-12 h-12 text-gray-400" />
              <p className="text-gray-500">
                {availableRooms.length === 0
                  ? 'Nenhum quarto disponível encontrado.'
                  : 'Nenhum quarto encontrado para seus critérios.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRooms.map((room) => {
                const Icon = getTypeIcon(room.type);
                return (
                  <div
                    key={room.id}
                    onClick={() => onSelectRoom(room)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${selectedRoom?.id === room.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-2 items-center min-w-0">
                        <Icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <h3 className="font-semibold text-gray-900 truncate">Quarto {room.number}</h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getTypeColor(room.type)}`}>
                        {getTypeLabel(room.type)}
                      </span>
                    </div>

                    <p className="mb-3 text-sm text-gray-600 line-clamp-2">{room.description}</p>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-2">
                      <div className="flex gap-1 items-center text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>Até {room.capacity}</span>
                      </div>
                      <div className="flex gap-1 items-center font-semibold text-green-600">
                        <DollarSign className="w-4 h-4" />
                        <span>R${room.price}/noite</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 order-2 sm:order-1"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (selectedRoom) {
                onClose();
              }
            }}
            disabled={!selectedRoom}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
          >
            Selecionar Quarto
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomSelector; 