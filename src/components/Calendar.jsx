import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Sparkles, Loader2, Filter, X } from 'lucide-react';
import PostCard from './PostCard';
import { OWNERS, getOwnerById } from '../config/owners';

const DAYS_OF_WEEK = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const statusLegend = [
  { label: 'Planejado', color: '#9CA3AF' },
  { label: 'Em Produção', color: '#F59E0B' },
  { label: 'Revisão', color: '#8B5CF6' },
  { label: 'Aprovado', color: '#10B981' },
  { label: 'Publicado', color: '#6366F1' },
];

function Calendar({ posts, onDayClick, onPostClick, onCreatePost, isLoading, ownerFilter, onOwnerFilterChange }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { calendarDays, monthStart, monthEnd } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const startDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    const days = [];
    
    // Previous month days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
      });
    }
    
    return {
      calendarDays: days,
      monthStart: firstDayOfMonth,
      monthEnd: lastDayOfMonth,
    };
  }, [currentDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getPostsForDate = (date) => {
    return posts.filter((post) => {
      const [day, month, year] = post.date.split('/');
      const postDate = new Date(year, month - 1, day);
      return (
        postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <div className="flex-1 px-4 md:px-8 py-4 md:py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <p className="text-[#6117F4] text-xs md:text-sm font-semibold tracking-widest uppercase mb-1">
            Planejamento Criativo
          </p>
          <h1 className="text-2xl md:text-4xl font-bold">
            <span className="text-[#1a1a2e]">{MONTHS[currentDate.getMonth()]}</span>
            <span className="text-[#6117F4] ml-2 md:ml-3">{currentDate.getFullYear()}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Month Navigation */}
          <div className="flex items-center bg-white rounded-full border border-[#E8E0F5] shadow-sm">
            <button
              onClick={goToPreviousMonth}
              className="p-2 md:p-3 text-[#6B7280] hover:text-[#6117F4] transition-colors"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <div className="w-px h-5 md:h-6 bg-[#E8E0F5]" />
            <button
              onClick={goToNextMonth}
              className="p-2 md:p-3 text-[#6B7280] hover:text-[#6117F4] transition-colors"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {/* Create Post Button */}
          <button
            onClick={onCreatePost}
            className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-[#1a1a2e] text-white font-medium rounded-xl hover:bg-[#2d2d4a] transition-all shadow-lg text-sm md:text-base"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Criar Post</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>
      </div>

      {/* Overview and Legend */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-3">
        <div className="flex items-center justify-between w-full md:w-auto gap-2">
          <div className="flex items-center gap-2 text-[#6B7280] text-xs md:text-sm">
            <Sparkles className="w-4 h-4 text-[#6117F4]" />
            <span>Visão Geral do Mês</span>
            {isLoading && (
              <Loader2 className="w-4 h-4 text-[#6117F4] animate-spin ml-2" />
            )}
          </div>

          {/* Owner Filter - Mobile */}
          <div className="relative md:hidden">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs ${
                ownerFilter.length > 0
                  ? 'border-[#6117F4] bg-[#F3EFFC] text-[#6117F4]'
                  : 'border-[#E8E0F5] bg-white text-[#6B7280] hover:border-[#C4B5F0]'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              {ownerFilter.length > 0 ? (
                <>
                  <div className="flex -space-x-1">
                    {ownerFilter.slice(0, 2).map((ownerId) => {
                      const owner = getOwnerById(ownerId);
                      return owner ? (
                        <div
                          key={ownerId}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold border-2 border-white"
                          style={{ backgroundColor: owner.color }}
                        >
                          {owner.initials.charAt(0)}
                        </div>
                      ) : null;
                    })}
                    {ownerFilter.length > 2 && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-medium bg-gray-200 text-gray-600 border-2 border-white">
                        +{ownerFilter.length - 2}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOwnerFilterChange([]);
                    }}
                    className="ml-1 hover:bg-[#6117F4]/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <span>Filtrar</span>
              )}
            </button>

            {/* Filter Dropdown - Mobile */}
            {isFilterOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsFilterOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E8E0F5] py-2 z-20 max-h-80 overflow-y-auto">
                  <button
                    onClick={() => {
                      onOwnerFilterChange([]);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      ownerFilter.length === 0 ? 'bg-[#F3EFFC] text-[#6117F4]' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6117F4] to-[#804AF0] flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">ALL</span>
                    </div>
                    <span className="flex-1">Todos</span>
                  </button>
                  <div className="border-t border-[#E8E0F5] my-2"></div>
                  {OWNERS.map((owner) => {
                    const isSelected = ownerFilter.includes(owner.id);
                    return (
                      <button
                        key={owner.id}
                        onClick={() => {
                          const newFilter = isSelected
                            ? ownerFilter.filter(id => id !== owner.id)
                            : [...ownerFilter, owner.id];
                          onOwnerFilterChange(newFilter);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          isSelected ? 'bg-[#F3EFFC] text-[#6117F4]' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                          style={{ backgroundColor: owner.color }}
                        >
                          {owner.initials}
                        </div>
                        <span className="flex-1">{owner.name}</span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#6117F4] flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 md:gap-4 flex-wrap">
          {/* Owner Filter - Desktop */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs md:text-sm ${
                ownerFilter.length > 0
                  ? 'border-[#6117F4] bg-[#F3EFFC] text-[#6117F4]'
                  : 'border-[#E8E0F5] bg-white text-[#6B7280] hover:border-[#C4B5F0]'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              {ownerFilter.length > 0 ? (
                <>
                  <span>
                    {ownerFilter.length === 1 
                      ? getOwnerById(ownerFilter[0])?.name 
                      : `${ownerFilter.length} selecionados`}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOwnerFilterChange([]);
                    }}
                    className="ml-1 hover:bg-[#6117F4]/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <span>Filtrar</span>
              )}
            </button>

            {/* Filter Dropdown - Desktop */}
            {isFilterOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsFilterOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E8E0F5] py-2 z-20 max-h-80 overflow-y-auto">
                  <button
                    onClick={() => {
                      onOwnerFilterChange([]);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      ownerFilter.length === 0 ? 'bg-[#F3EFFC] text-[#6117F4]' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6117F4] to-[#804AF0] flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">ALL</span>
                    </div>
                    <span className="flex-1">Todos</span>
                  </button>
                  <div className="border-t border-[#E8E0F5] my-2"></div>
                  {OWNERS.map((owner) => {
                    const isSelected = ownerFilter.includes(owner.id);
                    return (
                      <button
                        key={owner.id}
                        onClick={() => {
                          const newFilter = isSelected
                            ? ownerFilter.filter(id => id !== owner.id)
                            : [...ownerFilter, owner.id];
                          onOwnerFilterChange(newFilter);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          isSelected ? 'bg-[#F3EFFC] text-[#6117F4]' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                          style={{ backgroundColor: owner.color }}
                        >
                          {owner.initials}
                        </div>
                        <span className="flex-1">{owner.name}</span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#6117F4] flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Status Legend */}
          <div className="hidden md:flex items-center gap-4">
            {statusLegend.map((item) => (
              <div key={item.label} className="flex items-center gap-1 md:gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[#6B7280] text-[10px] md:text-xs">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl md:rounded-2xl border border-[#E8E0F5] overflow-hidden shadow-sm">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-[#E8E0F5] bg-[#FAFAFF]">
          {DAYS_OF_WEEK.map((day, index) => (
            <div
              key={day}
              className="py-2 md:py-4 text-center text-[#6B7280] text-[10px] md:text-xs font-semibold tracking-wider"
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((dayInfo, index) => {
            const dayPosts = getPostsForDate(dayInfo.date);
            const today = isToday(dayInfo.date);

            return (
              <div
                key={index}
                onClick={() => dayInfo.isCurrentMonth && onDayClick(dayInfo.date)}
                className={`min-h-[60px] md:min-h-[120px] p-1 md:p-2 border-b border-r border-[#E8E0F5] cursor-pointer transition-all duration-200 ${
                  dayInfo.isCurrentMonth
                    ? 'hover:bg-[#F9F7FE]'
                    : 'bg-[#FAFAFF] opacity-50 cursor-default'
                } ${today ? 'bg-[#F3EFFC] ring-2 ring-[#6117F4]/40 ring-inset' : ''}`}
              >
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 md:w-7 md:h-7 rounded-md md:rounded-lg text-xs md:text-sm font-medium mb-0.5 md:mb-1 ${
                    today
                      ? 'bg-[#6117F4] text-white'
                      : dayInfo.isCurrentMonth
                      ? 'text-[#1a1a2e]'
                      : 'text-[#9CA3AF]'
                  }`}
                >
                  {dayInfo.date.getDate()}
                </span>

                {/* Posts - Mobile: só indicadores, Desktop: cards */}
                <div className="hidden md:block space-y-1 max-h-[80px] overflow-y-auto custom-scrollbar">
                  {dayPosts.slice(0, 3).map((post) => (
                    <PostCard key={post.id} post={post} onClick={onPostClick} />
                  ))}
                  {dayPosts.length > 3 && (
                    <div className="text-[10px] text-[#6117F4] font-medium text-center">
                      +{dayPosts.length - 3} mais
                    </div>
                  )}
                </div>
                
                {/* Mobile: Indicadores de posts - clica no dia inteiro */}
                <div className="md:hidden flex flex-wrap gap-0.5 mt-0.5">
                  {dayPosts.slice(0, 4).map((post) => {
                    const statusColors = {
                      'Planejado': '#9CA3AF',
                      'Em Produção': '#F59E0B',
                      'Em Revisão': '#8B5CF6',
                      'Aprovado': '#10B981',
                      'Postado': '#6366F1',
                    };
                    return (
                      <div
                        key={post.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: statusColors[post.status] || '#9CA3AF' }}
                      />
                    );
                  })}
                  {dayPosts.length > 4 && (
                    <span className="text-[8px] text-[#6117F4] font-medium">+{dayPosts.length - 4}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
