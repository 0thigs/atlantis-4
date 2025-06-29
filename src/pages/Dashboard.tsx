import React, { useMemo } from 'react';
import {
  Users,
  BedDouble,
  CalendarCheck,
  TrendingUp,
  Clock,
  DollarSign,
  LogIn,
  LogOut,
  AlertCircle,
  Home
} from 'lucide-react';
import { DashboardStats } from '../types';
import { useHotelData } from '../hooks/useHotelData';

const Dashboard = () => {
  const { guests, rooms, bookings, dependents, getAccommodationAvailability } = useHotelData();

  const stats: DashboardStats = useMemo(() => {
    const totalGuests = guests.length;
    const totalRooms = rooms.length;
    const totalBookings = bookings.length;
    const totalDependents = dependents.length;

    const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    const today = new Date().toISOString().split('T')[0];
    const todayCheckIns = bookings.filter(booking =>
      booking.checkIn === today && booking.status === 'confirmed'
    ).length;
    const todayCheckOuts = bookings.filter(booking =>
      booking.checkOut === today && booking.status === 'checked-in'
    ).length;

    const revenue = bookings
      .filter(booking => booking.status === 'checked-out' || booking.status === 'checked-in')
      .reduce((sum, booking) => sum + booking.totalPrice, 0);

    return {
      totalGuests,
      totalRooms,
      totalBookings,
      totalDependents,
      occupancyRate: Math.round(occupancyRate * 10) / 10,
      todayCheckIns,
      todayCheckOuts,
      revenue
    };
  }, [guests, rooms, bookings, dependents]);

  const upcomingCheckIns = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return bookings
      .filter(booking => booking.checkIn === today && booking.status === 'confirmed')
      .slice(0, 3)
      .map(booking => {
        const guest = guests.find(g => g.id === booking.guestId);
        const room = rooms.find(r => r.id === booking.roomId);
        return {
          id: booking.id,
          guestName: guest?.name || 'Hóspede Desconhecido',
          roomNumber: room?.number || 'Quarto Desconhecido',
          time: '14:00'
        };
      });
  }, [bookings, guests, rooms]);

  const upcomingCheckOuts = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return bookings
      .filter(booking => booking.checkOut === today && booking.status === 'checked-in')
      .slice(0, 3)
      .map(booking => {
        const guest = guests.find(g => g.id === booking.guestId);
        const room = rooms.find(r => r.id === booking.roomId);
        return {
          id: booking.id,
          guestName: guest?.name || 'Hóspede Desconhecido',
          roomNumber: room?.number || 'Quarto Desconhecido',
          time: '11:00'
        };
      });
  }, [bookings, guests, rooms]);

  const alerts = useMemo(() => {
    const alertList = [];

    const maintenanceRooms = rooms.filter(room => room.status === 'maintenance');
    if (maintenanceRooms.length > 0) {
      alertList.push({
        id: 'maintenance',
        message: `${maintenanceRooms.length} quarto(s) em manutenção`,
        type: 'warning'
      });
    }

    const availableRooms = rooms.filter(room => room.status === 'available').length;
    if (availableRooms <= 2 && rooms.length > 0) {
      alertList.push({
        id: 'availability',
        message: `Apenas ${availableRooms} quartos disponíveis`,
        type: 'important'
      });
    }

    if (guests.length === 0 && rooms.length === 0) {
      alertList.push({
        id: 'welcome',
        message: 'Bem-vindo! Comece adicionando quartos e hóspedes ao seu hotel.',
        type: 'info'
      });
    }

    return alertList;
  }, [rooms, guests]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
  }) => (
    <div className="p-6 bg-white rounded-lg shadow-md transition-shadow hover:shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Painel de Controle</h1>
          <p className="text-gray-600">Bem-vindo de volta! Veja o que está acontecendo no Hotel Atlantis.</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Hóspedes"
          value={stats.totalGuests}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total de Dependentes"
          value={stats.totalDependents}
          icon={Users}
          color="bg-indigo-500"
        />
        <StatCard
          title="Total de Quartos"
          value={stats.totalRooms}
          icon={BedDouble}
          color="bg-green-500"
        />
        <StatCard
          title="Reservas Ativas"
          value={stats.totalBookings}
          icon={CalendarCheck}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 bg-white rounded-lg shadow-md sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Receita</h3>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600 sm:text-3xl">R${stats.revenue.toLocaleString()}</p>
          <p className="mt-1 text-sm text-gray-600">Este mês</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Check-ins de Hoje</h3>
            <LogIn className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600 sm:text-3xl">{stats.todayCheckIns}</p>
          <p className="mt-1 text-sm text-gray-600">Agendados para hoje</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md sm:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Check-outs de Hoje</h3>
            <LogOut className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600 sm:text-3xl">{stats.todayCheckOuts}</p>
          <p className="mt-1 text-sm text-gray-600">Agendados para hoje</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-4 bg-white rounded-lg shadow-md sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Próximos Check-ins</h3>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            {upcomingCheckIns.map((checkin) => (
              <div key={checkin.id} className="flex flex-col gap-2 p-3 bg-blue-50 rounded-lg sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <p className="font-medium text-gray-900">{checkin.guestName}</p>
                  <p className="text-sm text-gray-600">Quarto {checkin.roomNumber}</p>
                </div>
                <span className="text-sm font-medium text-blue-600">{checkin.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Próximos Check-outs</h3>
            <Clock className="w-5 h-5 text-red-500" />
          </div>
          <div className="space-y-3">
            {upcomingCheckOuts.map((checkout) => (
              <div key={checkout.id} className="flex flex-col gap-2 p-3 bg-red-50 rounded-lg sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <p className="font-medium text-gray-900">{checkout.guestName}</p>
                  <p className="text-sm text-gray-600">Quarto {checkout.roomNumber}</p>
                </div>
                <span className="text-sm font-medium text-red-600">{checkout.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow-md sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Alertas Importantes</h3>
          <AlertCircle className="w-5 h-5 text-yellow-500" />
        </div>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border-l-4 ${alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                alert.type === 'info' ? 'bg-blue-50 border-blue-400' :
                  'bg-red-50 border-red-400'
                }`}
            >
              <p className="text-sm text-gray-700">{alert.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
};

export default Dashboard; 