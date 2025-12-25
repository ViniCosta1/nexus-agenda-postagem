import React, { useState } from 'react';
import { Calendar, BarChart3, LogOut, ChevronDown, Menu, X } from 'lucide-react';

function Navbar({ activeTab, setActiveTab, userName, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8E0F5] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/LOGO SYSTEMS ROXO.png" 
            alt="Logo" 
            className="h-8 md:h-10 w-auto"
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-[#6B7280] hover:text-[#6117F4] transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Navigation Tabs - Desktop */}
        <div className="hidden md:flex items-center bg-[#F3EFFC] rounded-full p-1 border border-[#E8E0F5]">
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

        {/* User Profile with Dropdown - Desktop */}
        <div className="relative hidden md:block">
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#E8E0F5] px-4 py-4">
          {/* Mobile Navigation */}
          <div className="flex flex-col gap-2 mb-4">
            <button
              onClick={() => {
                setActiveTab('calendario');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'calendario'
                  ? 'bg-[#F3EFFC] text-[#6117F4]'
                  : 'text-[#6B7280] hover:bg-[#F9F7FE]'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Calendário
            </button>
            <button
              onClick={() => {
                setActiveTab('analytics');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-[#F3EFFC] text-[#6117F4]'
                  : 'text-[#6B7280] hover:bg-[#F9F7FE]'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </button>
          </div>

          {/* Mobile User Info */}
          <div className="border-t border-[#E8E0F5] pt-4">
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6117F4] to-[#804AF0] flex items-center justify-center text-white text-sm font-bold">
                {initials}
              </div>
              <span className="text-[#1a1a2e] text-sm font-medium">{userName}</span>
            </div>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
