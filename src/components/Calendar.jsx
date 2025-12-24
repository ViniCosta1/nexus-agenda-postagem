import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Sparkles, Loader2 } from 'lucide-react';
import PostCard from './PostCard';

const DAYS_OF_WEEK = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const statusLegend = [
  { label: 'Planned', color: '#9CA3AF' },
  { label: 'In Production', color: '#F59E0B' },
  { label: 'Review', color: '#8B5CF6' },
  { label: 'Approved', color: '#10B981' },
  { label: 'Posted', color: '#6366F1' },
];

function Calendar({ posts, onDayClick, onPostClick, onCreatePost, isLoading }) {
  const [currentDate, setCurrentDate] = useState(new Date());

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
    <div className="flex-1 px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#6117F4] text-sm font-semibold tracking-widest uppercase mb-1">
            Planejamento Criativo
          </p>
          <h1 className="text-4xl font-bold">
            <span className="text-[#1a1a2e]">{MONTHS[currentDate.getMonth()]}</span>
            <span className="text-[#6117F4] ml-3">{currentDate.getFullYear()}</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Month Navigation */}
          <div className="flex items-center bg-white rounded-full border border-[#E8E0F5] shadow-sm">
            <button
              onClick={goToPreviousMonth}
              className="p-3 text-[#6B7280] hover:text-[#6117F4] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-[#E8E0F5]" />
            <button
              onClick={goToNextMonth}
              className="p-3 text-[#6B7280] hover:text-[#6117F4] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Create Post Button */}
          <button
            onClick={onCreatePost}
            className="flex items-center gap-2 px-6 py-3 bg-[#1a1a2e] text-white font-medium rounded-xl hover:bg-[#2d2d4a] transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Criar Post
          </button>
        </div>
      </div>

      {/* Overview and Legend */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-[#6B7280] text-sm">
          <Sparkles className="w-4 h-4 text-[#6117F4]" />
          <span>Visão Geral do Mês</span>
          {isLoading && (
            <Loader2 className="w-4 h-4 text-[#6117F4] animate-spin ml-2" />
          )}
        </div>

        <div className="flex items-center gap-4">
          {statusLegend.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[#6B7280] text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-[#E8E0F5] overflow-hidden shadow-sm">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-[#E8E0F5] bg-[#FAFAFF]">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="py-4 text-center text-[#6B7280] text-xs font-semibold tracking-wider"
            >
              {day}
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
                className={`min-h-[120px] p-2 border-b border-r border-[#E8E0F5] cursor-pointer transition-all duration-200 ${
                  dayInfo.isCurrentMonth
                    ? 'hover:bg-[#F9F7FE]'
                    : 'bg-[#FAFAFF] opacity-50 cursor-default'
                } ${today ? 'bg-[#F3EFFC] ring-2 ring-[#6117F4]/40 ring-inset' : ''}`}
              >
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm font-medium mb-1 ${
                    today
                      ? 'bg-[#6117F4] text-white'
                      : dayInfo.isCurrentMonth
                      ? 'text-[#1a1a2e]'
                      : 'text-[#9CA3AF]'
                  }`}
                >
                  {dayInfo.date.getDate()}
                </span>

                {/* Posts */}
                <div className="space-y-1 max-h-[80px] overflow-y-auto custom-scrollbar">
                  {dayPosts.slice(0, 3).map((post) => (
                    <PostCard key={post.id} post={post} onClick={onPostClick} />
                  ))}
                  {dayPosts.length > 3 && (
                    <div className="text-[10px] text-[#6117F4] font-medium text-center">
                      +{dayPosts.length - 3} mais
                    </div>
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
