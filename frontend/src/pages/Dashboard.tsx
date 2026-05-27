import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, Users, Home, Calendar, Settings, 
  LogOut, Bell, Search, TrendingUp, DollarSign,
  ChevronRight, MoreHorizontal, User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiBase } from '../services/api';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        const response = await apiBase.get('/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('admin_token');
          navigate('/login');
        }
        throw err;
      }
    },
    enabled: !!token,
    retry: false,
  });

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-main">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const stats = [
    { label: 'Total Revenue', value: data?.stats.revenue, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Bookings', value: data?.stats.totalBookings, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Featured Properties', value: data?.stats.activeProperties, icon: Home, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'New Inquiries', value: data?.stats.newInquiries, icon: Bell, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="flex h-screen bg-bg-main">
      {/* Sidebar */}
      <aside className="w-72 bg-primary text-white p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-accent p-2 rounded-lg text-primary">
            <Home size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">Haven<span className="text-accent">Admin</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-accent font-semibold">
            <BarChart3 size={20} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl text-white/70 hover:text-white transition-all">
            <Calendar size={20} /> Bookings
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl text-white/70 hover:text-white transition-all">
            <Home size={20} /> Properties
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl text-white/70 hover:text-white transition-all">
            <Users size={20} /> Customers
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl text-white/70 hover:text-white transition-all">
            <Settings size={20} /> Settings
          </a>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 mt-auto text-white/50 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-primary">Welcome, {adminUser.username}</h1>
            <p className="text-text-muted">Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 rounded-xl border border-border outline-none focus:border-accent w-64 transition-all"
              />
            </div>
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-primary border-2 border-accent">
              <User size={24} />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-[2rem] shadow-sm border border-border"
            >
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
              </div>
              <p className="text-text-muted text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-primary mt-1">{stat.value}</h3>
              <div className="flex items-center gap-1 text-green-500 text-xs font-bold mt-2">
                <TrendingUp size={14} /> +12.5% vs last month
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tables/Lists */}
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-primary">Recent Inquiries</h3>
              <button className="text-accent font-bold text-sm flex items-center gap-1">View All <ChevronRight size={16} /></button>
            </div>
            <div className="space-y-4">
              {data?.recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-bg-main rounded-2xl transition-colors border border-transparent hover:border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                      <BarChart3 size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-primary">{activity.action}</p>
                      <p className="text-xs text-text-muted">{activity.time}</p>
                    </div>
                  </div>
                  <button className="text-text-muted hover:text-primary"><MoreHorizontal size={20} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4">Go Premium</h3>
              <p className="text-white/70 text-sm mb-6 leading-relaxed">
                Unlock advanced analytics and bulk property uploads. Upgrade your plan today.
              </p>
              <button className="bg-accent text-primary px-6 py-3 rounded-xl font-bold text-sm hover:bg-accent-hover transition-all">
                Upgrade Now
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          </div>
        </div>
      </main>

      <style jsx>{`
        .h-screen { height: 100vh; }
        .bg-bg-main { background-color: var(--bg-main); }
        .bg-primary { background-color: var(--primary); }
        .bg-accent { background-color: var(--accent); }
        .bg-accent\/20 { background-color: rgba(212, 175, 55, 0.2); }
        .bg-white { background-color: white; }
        .bg-white\/10 { background-color: rgba(255, 255, 255, 0.1); }
        .bg-white\/5 { background-color: rgba(255, 255, 255, 0.05); }
        .text-white { color: white; }
        .text-white\/70 { color: rgba(255, 255, 255, 0.7); }
        .text-white\/50 { color: rgba(255, 255, 255, 0.5); }
        .text-primary { color: var(--primary); }
        .text-accent { color: var(--accent); }
        .text-text-muted { color: var(--text-muted); }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .flex-1 { flex: 1; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .justify-between { justify-content: space-between; }
        .grid { display: grid; }
        .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .col-span-2 { grid-column: span 2 / span 2; }
        .gap-3 { gap: 0.75rem; }
        .gap-4 { gap: 1rem; }
        .gap-6 { gap: 1.5rem; }
        .gap-8 { gap: 2rem; }
        .p-8 { padding: 2rem; }
        .p-10 { padding: 2.5rem; }
        .p-6 { padding: 1.5rem; }
        .p-4 { padding: 1rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .w-72 { width: 18rem; }
        .w-12 { width: 3rem; }
        .w-10 { width: 2.5rem; }
        .w-64 { width: 16rem; }
        .h-12 { height: 3rem; }
        .h-10 { height: 2.5rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded-xl { border-radius: 0.75rem; }
        .rounded-2xl { border-radius: 1rem; }
        .rounded-\[2rem\] { border-radius: 2rem; }
        .rounded-\[2\.5rem\] { border-radius: 2.5rem; }
        .rounded-full { border-radius: 9999px; }
        .shadow-sm { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
        .border { border: 1px solid var(--border); }
        .border-t { border-top: 1px solid var(--border); }
        .border-r { border-right: 1px solid var(--border); }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .font-medium { font-weight: 500; }
        .text-xl { font-size: 1.25rem; }
        .text-2xl { font-size: 1.5rem; }
        .text-3xl { font-size: 1.875rem; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .overflow-y-auto { overflow-y: auto; }
        .leading-relaxed { line-height: 1.625; }
      `}</style>
    </div>
  );
};

export default Dashboard;
