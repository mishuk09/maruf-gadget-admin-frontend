import { Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CirclePlus,
  LogOut,
  Menu,
  X,
  Option,
  Pen,
  LayoutList,
} from "lucide-react";
import Dashboard from "../../components/Auth/Dashboard";
import { useState } from "react";
import MainDashboard from "../../components/MainDashboard";

const sections = [
  { id: 1, name: "Dashboard", icon: <LayoutDashboard />, path: "/", component: <MainDashboard /> },
  { id: 1, name: "All Products", icon: <LayoutList />, path: "/home", component: <Dashboard /> },
  // { id: 3, name: "Home Hews", icon: <CirclePlus />, path: "/new" },
  // { id: 3, name: "Semi Home News", icon: <CirclePlus />, path: "/offer" },
  // { id: 5, name: "Pool", icon: <Option />, path: "/pool" },
  // { id: 6, name: "Decision", icon: <Pen />, path: "/decision" },
  { id: 8, name: "Logout", icon: <LogOut />, path: "/logout" },
];

export default function Layout() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="flex h-auto overflow-x-auto min-h-screen  text-slate-100">
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className={`md:hidden p-2 ${
          isOpen
            ? "bg-[#0A0F1F] text-white fixed top-2 left-2 z-50 rounded-lg"
            : "bg-slate-200 text-slate-900 fixed top-2 left-2 z-50 rounded-lg"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#020617] text-white p-4 w-[250px] z-20 transform border-r border-slate-800 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:translate-x-0`}
      >
        <h1 className="text-xl border-b border-slate-600 font-bold pb-2 mt-14 md:mt-0 mb-6">Admin Dashboard</h1>
        <nav className="space-y-1  ">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`flex items-center gap-3 p-3   border-b border-slate-600 w-full text-left hover:bg-gray-700 transition 
                ${
                  section.name === "Logout"
                    ? "absolute bottom-0 text-center items-center justify-center flex rounded-none bg-red-500 text-white left-0 w-full"
                    : ""
                }`}
              onClick={() => {
                if (section.name === "Logout") {
                  handleLogout();
                } else {
                  navigate(section.path);
                  setIsOpen(false); // Close sidebar after navigation
                }
              }}
            >
              {section.icon}
              {section.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-[250px] min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
