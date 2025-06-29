import React, { useState } from 'react';
import {
  Bed,
  Users,
  Car,
  Wifi,
  AirVent,
  Tv,
  Coffee,
  Bath,
  Plus,
  Settings,
  Calendar,
  User,
  Home,
  ArrowRight
} from 'lucide-react';
import { AccommodationBuilder, ACCOMMODATION_CATEGORIES } from '../builders/AccommodationBuilder';
import { AccommodationCategory, AccommodationBuilder as IAccommodationBuilder, Guest, Room, Booking, CustomAccommodation } from '../types';
import { useHotelData } from '../hooks/useHotelData';
import GuestSelector from '../components/GuestSelector';
import RoomSelector from '../components/RoomSelector';
import { useToast } from '../components/Toast';

const Accommodations = () => {
  const { guests, rooms, addCustomAccommodation, addBooking, getAccommodationOccupancy, isAccommodationAvailable } = useHotelData();
  const { addToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<AccommodationCategory | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [customAccommodation, setCustomAccommodation] = useState<IAccommodationBuilder | null>(null);
  const [extraBeds, setExtraBeds] = useState(0);
  const [selectedPremiumAmenities, setSelectedPremiumAmenities] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState<string[]>([]);

  const [isBookingFlow, setIsBookingFlow] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [isGuestSelectorOpen, setIsGuestSelectorOpen] = useState(false);
  const [isRoomSelectorOpen, setIsRoomSelectorOpen] = useState(false);

  const premiumAmenities = [
    'Vista para o Mar',
    'Varanda Premium',
    'Banheiro Premium',
    'Serviço de Quarto',
    'Frigobar Premium',
    'Smart TV 65"',
    'Sistema de Som',
    'Roupa de Cama Premium'
  ];

  const specialRequestOptions = [
    'Check-out Tardio',
    'Check-in Antecipado',
    'Travesseiros Extras',
    'Roupa de Cama Hipoalergênica',
    'Configuração Pet Friendly',
    'Berço para Bebê',
    'Acessível para Cadeirantes',
    'Quarto Silencioso'
  ];

  const getIconForAmenity = (amenity: string) => {
    const iconMap: { [key: string]: any } = {
      'Ar Condicionado': AirVent,
      'Banheiro Privativo': Bath,
      'TV': Tv,
      'WiFi': Wifi,
      'Frigobar': Coffee,
      'Mesa de Trabalho': Settings,
      'Varanda': Home,
      'Cozinha': Coffee,
      'Cozinha Completa': Coffee,
      'Sala de Estar': Home,
      'Jacuzzi': Bath,
    };
    return iconMap[amenity] || Settings;
  };

  const handleBuildAccommodation = () => {
    if (!selectedCategory) return;

    const builder = AccommodationBuilder.createFromCategory(selectedCategory.id);

    if (extraBeds > 0) {
      builder.addExtraBeds(extraBeds);
    }

    if (selectedPremiumAmenities.length > 0) {
      builder.addPremiumAmenities(selectedPremiumAmenities);
    }

    if (specialRequests.length > 0) {
      builder.addSpecialRequests(specialRequests);
    }

    const result = builder.build();
    setCustomAccommodation(result);
    setIsBuilderOpen(false);
  };

  const handleProceedToBooking = () => {
    if (!customAccommodation) return;
    setIsBookingFlow(true);
  };

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    if (!customAccommodation) return 0;
    const builder = AccommodationBuilder.createFromCategory(customAccommodation.category.id);
    if (extraBeds > 0) builder.addExtraBeds(extraBeds);
    if (selectedPremiumAmenities.length > 0) builder.addPremiumAmenities(selectedPremiumAmenities);
    const pricePerNight = builder.calculateTotalPrice();
    return pricePerNight * calculateNights();
  };

  const handleCompleteBooking = () => {
    if (!customAccommodation || !selectedGuest || !selectedRoom || !checkInDate || !checkOutDate) {
      addToast({ type: 'error', title: 'Por favor, preencha todos os detalhes da reserva' });
      return;
    }

    if (!isAccommodationAvailable(customAccommodation.category.id)) {
      addToast({ type: 'error', title: 'Esta categoria de acomodação não está mais disponível' });
      resetAll();
      return;
    }

    const savedAccommodation: CustomAccommodation = {
      id: Date.now().toString(),
      name: `${customAccommodation.category.name} - Personalizada`,
      category: customAccommodation.category,
      customizations: {
        extraBeds,
        premiumAmenities: selectedPremiumAmenities,
        specialRequests
      },
      totalPrice: AccommodationBuilder.createFromCategory(customAccommodation.category.id)
        .addExtraBeds(extraBeds)
        .addPremiumAmenities(selectedPremiumAmenities)
        .calculateTotalPrice(),
      createdAt: new Date().toISOString()
    };

    addCustomAccommodation(savedAccommodation);

    const booking: Booking = {
      id: Date.now().toString(),
      guestId: selectedGuest.id,
      roomId: selectedRoom.id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      status: 'confirmed',
      totalPrice: calculateTotalPrice(),
      customAccommodation: savedAccommodation
    };

    addBooking(booking);
    addToast({ type: 'success', title: 'Reserva criada com sucesso!' });
    resetAll();
  };

  const resetAll = () => {
    setSelectedCategory(null);
    setCustomAccommodation(null);
    setExtraBeds(0);
    setSelectedPremiumAmenities([]);
    setSpecialRequests([]);
    setIsBuilderOpen(false);
    setIsBookingFlow(false);
    setSelectedGuest(null);
    setSelectedRoom(null);
    setCheckInDate('');
    setCheckOutDate('');
  };

  const resetBuilder = () => {
    setSelectedCategory(null);
    setCustomAccommodation(null);
    setExtraBeds(0);
    setSelectedPremiumAmenities([]);
    setSpecialRequests([]);
    setIsBuilderOpen(false);
  };

  const closeBuilderModal = () => {
    setIsBuilderOpen(false);
  };

  const CategoryCard = ({ category }: { category: AccommodationCategory }) => {
    const { occupied, total, available } = getAccommodationOccupancy(category.id);
    const isAvailable = available > 0;

    return (
      <div className={`p-6 bg-white rounded-lg shadow-md transition-shadow hover:shadow-lg ${!isAvailable ? 'opacity-75' : ''}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
            <p className="mt-1 text-sm text-gray-600">{category.description}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">R${category.basePrice}</p>
            <p className="text-sm text-gray-500">por noite</p>
          </div>
        </div>

        {/* Indicador de Disponibilidade */}
        <div className="flex justify-between items-center p-3 mb-4 bg-gray-50 rounded-lg">
          <div className="flex gap-2 items-center">
            <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {isAvailable ? 'Disponível' : 'Esgotado'}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <span className={`font-semibold ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
              {available}
            </span>
            <span className="text-gray-500"> / {total} unidades</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex gap-2 items-center">
            <Bed className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{category.beds} cama{category.beds > 1 ? 's' : ''}</span>
          </div>
          <div className="flex gap-2 items-center">
            <Bath className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{category.suites} suíte{category.suites > 1 ? 's' : ''}</span>
          </div>
          <div className="flex gap-2 items-center">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">Até {category.maxOccupancy} hóspedes</span>
          </div>
          <div className="flex gap-2 items-center">
            <Car className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{category.garage ? 'Garagem' : 'Sem garagem'}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Comodidades:</p>
          <div className="flex flex-wrap gap-2">
            {category.amenities.map((amenity, index) => {
              const Icon = getIconForAmenity(amenity);
              return (
                <div key={index} className="flex gap-1 items-center px-2 py-1 bg-gray-100 rounded-full">
                  <Icon className="w-3 h-3 text-gray-600" />
                  <span className="text-xs text-gray-700">{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => {
            if (isAvailable) {
              setSelectedCategory(category);
              setIsBuilderOpen(true);
            }
          }}
          disabled={!isAvailable}
          className={`flex gap-2 justify-center items-center px-4 py-2 w-full rounded-lg transition-colors ${isAvailable
            ? 'text-white bg-blue-600 hover:bg-blue-700'
            : 'text-gray-500 bg-gray-300 cursor-not-allowed'
            }`}
        >
          <Plus className="w-4 h-4" />
          {isAvailable ? 'Personalizar e Reservar' : 'Esgotado'}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorias de Acomodação</h1>
          <p className="text-gray-600">Escolha entre nossas categorias premium de acomodação e crie sua reserva</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ACCOMMODATION_CATEGORIES.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      {isBuilderOpen && selectedCategory && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Personalizar {selectedCategory.name}
                </h2>
                <button
                  onClick={closeBuilderModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="mb-2 font-semibold text-gray-900">Configuração Base</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Camas: {selectedCategory.beds}</div>
                    <div>Suítes: {selectedCategory.suites}</div>
                    <div>Ocupação Máxima: {selectedCategory.maxOccupancy}</div>
                    <div>Preço Base: R${selectedCategory.basePrice}/noite</div>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Camas Extras (+R$30 cada)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={extraBeds}
                    onChange={(e) => setExtraBeds(Number(e.target.value))}
                    className="px-3 py-2 w-full rounded-md border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Comodidades Premium (+R$25 cada)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {premiumAmenities.map((amenity) => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedPremiumAmenities.includes(amenity)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPremiumAmenities([...selectedPremiumAmenities, amenity]);
                            } else {
                              setSelectedPremiumAmenities(selectedPremiumAmenities.filter(a => a !== amenity));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Solicitações Especiais (Grátis)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {specialRequestOptions.map((request) => (
                      <label key={request} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={specialRequests.includes(request)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSpecialRequests([...specialRequests, request]);
                            } else {
                              setSpecialRequests(specialRequests.filter(r => r !== request));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{request}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleBuildAccommodation}
                    className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Criar Acomodação Personalizada
                  </button>
                  <button
                    onClick={resetBuilder}
                    className="px-4 py-2 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {customAccommodation && !isBookingFlow && (
        <div className="p-6 bg-green-50 rounded-lg border border-green-200">
          <h3 className="mb-4 text-lg font-bold text-green-800">
            Acomodação Personalizada Criada com Sucesso!
          </h3>
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold text-gray-900">Categoria Base:</h4>
              <p className="text-gray-700">{customAccommodation.category.name}</p>

              <h4 className="mt-3 font-semibold text-gray-900">Preço Total:</h4>
              <p className="text-2xl font-bold text-green-600">
                R${AccommodationBuilder.createFromCategory(customAccommodation.category.id)
                  .addExtraBeds(extraBeds)
                  .addPremiumAmenities(selectedPremiumAmenities)
                  .calculateTotalPrice()}/noite
              </p>
            </div>
            <div>
              {customAccommodation.customizations.extraBeds && (
                <div>
                  <h4 className="font-semibold text-gray-900">Camas Extras:</h4>
                  <p className="text-gray-700">{customAccommodation.customizations.extraBeds}</p>
                </div>
              )}

              {customAccommodation.customizations.premiumAmenities && customAccommodation.customizations.premiumAmenities.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-semibold text-gray-900">Comodidades Premium:</h4>
                  <ul className="text-sm text-gray-700">
                    {customAccommodation.customizations.premiumAmenities.map((amenity, index) => (
                      <li key={index}>• {amenity}</li>
                    ))}
                  </ul>
                </div>
              )}

              {customAccommodation.customizations.specialRequests && customAccommodation.customizations.specialRequests.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-semibold text-gray-900">Solicitações Especiais:</h4>
                  <ul className="text-sm text-gray-700">
                    {customAccommodation.customizations.specialRequests.map((request, index) => (
                      <li key={index}>• {request}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleProceedToBooking}
              className="flex gap-2 items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Calendar className="w-4 h-4" />
              Prosseguir para Reserva
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={resetBuilder}
              className="px-4 py-2 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Criar Outra
            </button>
          </div>
        </div>
      )}

      {isBookingFlow && customAccommodation && (
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="mb-6 text-2xl font-bold text-gray-900">Complete Sua Reserva</h3>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h4 className="mb-4 text-lg font-semibold text-gray-900">Detalhes da Reserva</h4>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Hóspede</label>
                  <button
                    onClick={() => setIsGuestSelectorOpen(true)}
                    className="flex gap-2 items-center p-3 w-full text-left rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    {selectedGuest ? (
                      <span className="text-gray-900">{selectedGuest.name} ({selectedGuest.email})</span>
                    ) : (
                      <span className="text-gray-500">Selecionar um hóspede</span>
                    )}
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Quarto</label>
                  <button
                    onClick={() => setIsRoomSelectorOpen(true)}
                    className="flex gap-2 items-center p-3 w-full text-left rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    <Home className="w-4 h-4 text-gray-500" />
                    {selectedRoom ? (
                      <span className="text-gray-900">Quarto {selectedRoom.number} ({selectedRoom.type})</span>
                    ) : (
                      <span className="text-gray-500">Selecionar um quarto</span>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Data de Check-in</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="px-3 py-2 w-full rounded-lg border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Data de Check-out</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      min={checkInDate || new Date().toISOString().split('T')[0]}
                      className="px-3 py-2 w-full rounded-lg border border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <h4 className="mb-4 text-lg font-semibold text-gray-900">Resumo da Reserva</h4>

              <div className="mb-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Acomodação:</span>
                  <span className="font-medium">{customAccommodation.category.name}</span>
                </div>

                {extraBeds > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Camas Extras:</span>
                    <span className="font-medium">{extraBeds} × R$30</span>
                  </div>
                )}

                {selectedPremiumAmenities.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Comodidades Premium:</span>
                    <span className="font-medium">{selectedPremiumAmenities.length} × R$25</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Preço por noite:</span>
                  <span className="font-medium">
                    R${AccommodationBuilder.createFromCategory(customAccommodation.category.id)
                      .addExtraBeds(extraBeds)
                      .addPremiumAmenities(selectedPremiumAmenities)
                      .calculateTotalPrice()}
                  </span>
                </div>

                {calculateNights() > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Noites:</span>
                    <span className="font-medium">{calculateNights()}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">R${calculateTotalPrice()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCompleteBooking}
              disabled={!selectedGuest || !selectedRoom || !checkInDate || !checkOutDate}
              className="flex gap-2 items-center px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calendar className="w-4 h-4" />
              Finalizar Reserva
            </button>
            <button
              onClick={() => setIsBookingFlow(false)}
              className="px-4 py-2 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Voltar para Acomodação
            </button>
            <button
              onClick={() => setIsBuilderOpen(false)}
              className="px-4 py-2 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Cancelar
            </button>
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
          minCapacity={customAccommodation ? customAccommodation.category.maxOccupancy : 1}
        />
      )}
    </div>
  );
};

export default Accommodations; 