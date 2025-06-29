import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Guests from './pages/Guests';
import Rooms from './pages/Rooms';
import Accommodations from './pages/Accommodations';
import Bookings from './pages/Bookings';
import { HotelDataProvider } from './hooks/useHotelData';

function App() {
  return (
    <HotelDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="guests" element={<Guests />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="accommodations" element={<Accommodations />} />
            <Route path="bookings" element={<Bookings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HotelDataProvider>
  );
}

export default App;