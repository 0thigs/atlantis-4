import React, { useState } from 'react';
import { User, Search, X } from 'lucide-react';
import { Guest } from '../types';

interface GuestSelectorProps {
  guests: Guest[];
  selectedGuest: Guest | null;
  onSelectGuest: (guest: Guest | null) => void;
  onClose: () => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({
  guests,
  selectedGuest,
  onSelectGuest,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.document.includes(searchTerm)
  );

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Selecionar Hóspede</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh]">
          {filteredGuests.length === 0 ? (
            <div className="py-8 text-center">
              <User className="mx-auto mb-4 w-12 h-12 text-gray-400" />
              <p className="text-gray-500">
                {guests.length === 0 ? 'Nenhum hóspede cadastrado ainda.' : 'Nenhum hóspede encontrado para sua busca.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filteredGuests.map((guest) => (
                <div
                  key={guest.id}
                  onClick={() => onSelectGuest(guest)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${selectedGuest?.id === guest.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{guest.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{guest.email}</p>
                      <p className="text-sm text-gray-600">{guest.phone}</p>
                    </div>
                    <div className="text-sm text-gray-500 sm:text-right">
                      <p>Idade: {calculateAge(guest.birthDate)}</p>
                      <p className="truncate">{guest.nationality}</p>
                    </div>
                  </div>
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 truncate">Documento: {guest.document}</p>
                    <p className="text-xs text-gray-500 truncate">{guest.address}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 justify-end p-4 border-t border-gray-200 sm:flex-row sm:p-6">
          <button
            onClick={onClose}
            className="order-2 px-4 py-2 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 sm:order-1"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (selectedGuest) {
                onClose();
              }
            }}
            disabled={!selectedGuest}
            className="order-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed sm:order-2"
          >
            Selecionar Hóspede
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestSelector; 