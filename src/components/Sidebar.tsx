import { useState } from "react";
import {
  Hotel,
  Users,
  BedDouble,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Building,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const isActive = (path: string) => {
    return location.pathname === path ? "bg-blue-700" : "";
  };

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Painel" },
    { path: "/guests", icon: Users, label: "Hóspedes" },
    { path: "/rooms", icon: BedDouble, label: "Quartos" },
    { path: "/accommodations", icon: Building, label: "Acomodações" },
    { path: "/bookings", icon: CalendarCheck, label: "Reservas" },
  ];

  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`bg-blue-800 text-white ${isExpanded ? "w-64" : "w-20"
        } min-h-screen p-4 transition-all duration-300 ease-in-out relative group`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="hidden absolute -right-3 top-8 p-1 bg-blue-600 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none lg:block"
      >
        {isExpanded ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      <div
        className={`flex items-center gap-2 mb-8 ${!isExpanded && "justify-center"
          }`}
      >
        <Hotel
          className={`h-8 w-8 transition-all duration-300 ${!isExpanded && "transform scale-110"
            }`}
        />

        {isExpanded && (
          <h1
            className={`text-2xl font-bold transition-opacity duration-300 ${!isExpanded ? "w-0 opacity-0" : "opacity-100"
              }`}
          >
            Atlantis
          </h1>
        )}
      </div>

      <nav className="space-y-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            onClick={handleNavClick}
            className={`flex items-center gap-3 p-3 rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 ${isActive(
              path
            )} ${!isExpanded && "justify-center"}`}
          >
            <Icon
              className={`h-5 w-5 transition-transform duration-200 ${!isExpanded && "transform scale-110"
                }`}
            />
            <span
              className={`transition-opacity duration-300 ${!isExpanded ? "w-0 opacity-0" : "opacity-100"
                }`}
            >
              {label}
            </span>
          </Link>
        ))}
      </nav>

      <div
        className={`absolute bottom-4 left-4 right-4 border-t border-blue-700 pt-4 transition-opacity duration-300 ${!isExpanded ? "opacity-0" : "opacity-100"
          }`}
      >
        <div className="text-sm text-center text-blue-300">
          Sistema de Gestão Hoteleira
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
