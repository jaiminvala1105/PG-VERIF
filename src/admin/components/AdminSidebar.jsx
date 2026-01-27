import { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Home, Users, LogOut, ArrowLeft } from 'lucide-react';
import { AuthUser } from '../../context/AuthuserContext'; 
import { FetchDataFromBackend } from '../../context/BackendUserContext';

const AdminSidebar = () => {
  const { logout } = useContext(AuthUser);
  const { userData } = useContext(FetchDataFromBackend);

  const navItems = [
    { 
      path: '/admin', 
      icon: LayoutDashboard, 
      label: 'Overview', 
      end: true,
      allowedRoles: ['admin', 'owner']
    },
    { 
      path: '/admin/pgs', 
      icon: Home, 
      label: userData?.role === 'owner' ? 'My PGs' : 'Manage PGs',
      allowedRoles: ['admin', 'owner']
    },
    { 
      path: '/admin/users', 
      icon: Users, 
      label: 'Manage Users',
      allowedRoles: ['admin'] // Restricted to main Admin
    },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-full flex flex-col p-4 border-r border-gray-800">
      <div className="mb-8 p-2 flex items-center gap-3">
        <Link 
          to="/"
          className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
          title="Back to Home"
        >
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          {userData?.role === 'owner' ? 'Owner Panel' : 'Admin Panel'}
        </h2>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems
          .filter(item => item.allowedRoles.includes(userData?.role || ''))
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-800">
        <button 
          onClick={logout} 
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
