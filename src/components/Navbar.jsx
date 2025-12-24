import React, { useState } from 'react';
import { Calendar, BarChart3, LogOut, ChevronDown } from 'lucide-react';

function Navbar({ activeTab, setActiveTab, userName, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8E0F5] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/LOGO SYSTEMS ROXO.png" 
            alt="Logo" 
            className="h-10 w-auto"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-[#F3EFFC] rounded-full p-1 border border-[#E8E0F5]">
          <button
            onClick={() => setActiveTab('calendario')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === 'calendario'
                ? 'bg-white text-[#6117F4] shadow-md border border-[#E8E0F5]'
                : 'text-[#6B7280] hover:text-[#6117F4]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Calendário
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === 'analytics'
                ? 'bg-white text-[#6117F4] shadow-md border border-[#E8E0F5]'
                : 'text-[#6B7280] hover:text-[#6117F4]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
        </div>

        {/* User Profile with Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 hover:bg-[#F3EFFC] rounded-xl px-3 py-2 transition-colors"
          >
            <span className="text-[#1a1a2e] text-sm font-medium">{userName}</span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6117F4] to-[#804AF0] flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
            <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Backdrop to close dropdown */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsDropdownOpen(false)}
              />
              
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E8E0F5] py-2 z-20">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
