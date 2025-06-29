import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, X, User, Home, Star, Calendar } from 'lucide-react';
import { Booking, Guest, Room } from '../types';
import { useHotelData } from '../hooks/useHotelData';
import GuestSelector from '../components/GuestSelector';
import RoomSelector from '../components/RoomSelector';

const Bookings = () => {
  const { bookings, guests, rooms, addBooking, updateBooking, deleteBooking } = useHotelData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isGuestSelectorOpen, setIsGuestSelectorOpen] = useState(false);
  const [isRoomSelectorOpen, setIsRoomSelectorOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Booking, 'id'>>({
    guestId: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    status: 'confirmed',
    totalPrice: 0
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalPrice' ? Number(value) : value
    }));
  };

  const resetForm = () => {
    setFormData({
      guestId: '',
      roomId: '',
      checkIn: '',
      checkOut: '',
      status: 'confirmed',
      totalPrice: 0
    });
    setSelectedGuest(null);
    setSelectedRoom(null);
    setEditingBooking(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalFormData = {
      ...formData,
      guestId: selectedGuest?.id || formData.guestId,
      roomId: selectedRoom?.id || formData.roomId
    };

    if (editingBooking) {
      updateBooking(editingBooking.id, finalFormData);
    } else {
      addBooking({ ...finalFormData, id: String(Date.now()) });
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setFormData({
      guestId: booking.guestId,
      roomId: booking.roomId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      status: booking.status,
      totalPrice: booking.totalPrice
    });

    const guest = guests.find(g => g.id === booking.guestId);
    const room = rooms.find(r => r.id === booking.roomId);
    setSelectedGuest(guest || null);
    setSelectedRoom(room || null);

    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza de que deseja excluir esta reserva?')) {
      deleteBooking(id);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Gestão de Reservas</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex gap-2 justify-center items-center px-4 py-2 w-full text-white bg-blue-600 rounded-lg hover:bg-blue-700 sm:w-auto"
        >
          <PlusCircle className="w-5 h-5" />
          Nova Reserva
        </button>
      </div>

      <div className="overflow-hidden bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-3 py-3 text-sm font-semibold text-left text-gray-600 sm:px-6">Hóspede</th>
                <th className="hidden px-3 py-3 text-sm font-semibold text-left text-gray-600 sm:px-6 sm:table-cell">Quarto</th>
                <th className="hidden px-3 py-3 text-sm font-semibold text-left text-gray-600 sm:px-6 lg:table-cell">Acomodação</th>
                <th className="hidden px-3 py-3 text-sm font-semibold text-left text-gray-600 sm:px-6 md:table-cell">Check In</th>
                <th className="hidden px-3 py-3 text-sm font-semibold text-left text-gray-600 sm:px-6 md:table-cell">Check Out</th>
                <th className="px-3 py-3 text-sm font-semibold text-left text-gray-600 sm:px-6">Status</th>
                <th className="hidden px-3 py-3 text-sm font-semibold text-left text-gray-600 sm:px-6 sm:table-cell">Total</th>
                <th className="px-3 py-3 text-sm font-semibold text-right text-gray-600 sm:px-6">Ações</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <Calendar className="mx-auto mb-4 w-12 h-12 text-gray-400" />
                    <p>Nenhuma reserva encontrada.</p>
                    <p className="text-sm">Crie sua primeira reserva usando o botão acima.</p>
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const guest = guests.find(g => g.id === booking.guestId);
                  const room = rooms.find(r => r.id === booking.roomId);

                  return (
                    <tr key={booking.id} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-4 sm:px-6">
                        <div className="flex gap-2 items-center">
                          <User className="hidden w-4 h-4 text-gray-400 sm:block" />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{guest?.name || 'Hóspede Desconhecido'}</p>
                            <p className="hidden text-sm text-gray-500 truncate sm:block">{guest?.email}</p>
                            <div className="space-y-1 text-xs text-gray-500 sm:hidden">
                              <p>Quarto {room?.number || booking.roomId}</p>
                              <p>{booking.checkIn} - {booking.checkOut}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-3 py-4 sm:px-6 sm:table-cell">
                        <div className="flex gap-2 items-center">
                          <Home className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Quarto {room?.number || booking.roomId}</p>
                            <p className="text-sm text-gray-500 capitalize">{room?.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-3 py-4 sm:px-6 lg:table-cell">
                        {booking.customAccommodation ? (
                          <div className="flex gap-2 items-center">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <div>
                              <p className="font-medium text-gray-900">{booking.customAccommodation.category.name}</p>
                              <p className="text-sm text-gray-500">Pacote Personalizado</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Padrão</span>
                        )}
                      </td>
                      <td className="hidden px-3 py-4 sm:px-6 md:table-cell">{booking.checkIn}</td>
                      <td className="hidden px-3 py-4 sm:px-6 md:table-cell">{booking.checkOut}</td>
                      <td className="px-3 py-4 sm:px-6">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'checked-in' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'checked-out' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                          }`}>
                          {booking.status === 'confirmed' ? 'Confirmada' :
                            booking.status === 'checked-in' ? 'Check-in' :
                              booking.status === 'checked-out' ? 'Check-out' :
                                booking.status === 'cancelled' ? 'Cancelada' : booking.status}
                        </span>
                      </td>
                      <td className="hidden px-3 py-4 font-semibold sm:px-6 sm:table-cell">R${booking.totalPrice}</td>
                      <td className="px-3 py-4 text-right sm:px-6">
                        <div className="flex gap-1 justify-end sm:gap-3">
                          <button
                            onClick={() => handleEdit(booking)}
                            className="p-1 text-blue-600 sm:p-0 hover:text-blue-800"
                            title="Editar reserva"
                          >
                            <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="p-1 text-red-600 sm:p-0 hover:text-red-800"
                            title="Excluir reserva"
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="p-6 sm:p-8 w-full max-w-md bg-white rounded-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold sm:text-xl">
                {editingBooking ? 'Editar Reserva' : 'Nova Reserva'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Hóspede</label>
                <button
                  type="button"
                  onClick={() => setIsGuestSelectorOpen(true)}
                  className="flex gap-2 items-center p-3 w-full text-left rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  <User className="w-4 h-4 text-gray-500" />
                  {selectedGuest ? (
                    <span className="text-gray-900 truncate">{selectedGuest.name} ({selectedGuest.email})</span>
                  ) : (
                    <span className="text-gray-500">Selecionar um hóspede</span>
                  )}
                </button>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Quarto</label>
                <button
                  type="button"
                  onClick={() => setIsRoomSelectorOpen(true)}
                  className="flex gap-2 items-center p-3 w-full text-left rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  <Home className="w-4 h-4 text-gray-500" />
                  {selectedRoom ? (
                    <span className="text-gray-900 truncate">Quarto {selectedRoom.number} ({selectedRoom.type})</span>
                  ) : (
                    <span className="text-gray-500">Selecionar um quarto</span>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Data de Check In
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    required
                    className="px-3 py-2 w-full rounded-md border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Data de Check Out
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    required
                    className="px-3 py-2 w-full rounded-md border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="px-3 py-2 w-full rounded-md border border-gray-300"
                >
                  <option value="confirmed">Confirmada</option>
                  <option value="checked-in">Check-in Feito</option>
                  <option value="checked-out">Check-out Feito</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Preço Total
                </label>
                <input
                  type="number"
                  name="totalPrice"
                  value={formData.totalPrice}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="px-3 py-2 w-full rounded-md border border-gray-300"
                />
              </div>

              <div className="flex flex-col gap-2 justify-end mt-6 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="order-2 px-4 py-2 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 sm:order-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="order-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 sm:order-2"
                >
                  {editingBooking ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isGuestSelectorOpen && (
        <GuestSelector
          guests={guests}
          selectedGuest={selectedGuest}
          onSelectGuest={setSelectedGuest}
          onClose={() => setIsGuestSelectorOpen(false)}
        />
      )}

      {isRoomSelectorOpen && (
        <RoomSelector
          rooms={rooms}
          selectedRoom={selectedRoom}
          onSelectRoom={setSelectedRoom}
          onClose={() => setIsRoomSelectorOpen(false)}
        />
      )}
    </div>
  );
};

export default Bookings;