import React from 'react';
import { X, Plus, Calendar, Image, Video, CircleDot, LayoutGrid } from 'lucide-react';
import { getOwnersByIds, getAccountById, getResponsibleById } from '../config/owners';

const contentTypeIcons = {
  'Post (Imagem)': Image,
  'Reel (Vídeo)': Video,
  'Story': CircleDot,
  'Carrossel': LayoutGrid,
};

const statusColors = {
  'Planejado': { bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' },
  'Em Produção': { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
  'Em Revisão': { bg: '#EDE9FE', text: '#6D28D9', dot: '#8B5CF6' },
  'Aprovado': { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  'Postado': { bg: '#E0E7FF', text: '#3730A3', dot: '#6366F1' },
};

const DAYS_OF_WEEK = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function DayDetailModal({ isOpen, onClose, selectedDate, posts, onPostClick, onCreatePost }) {
  if (!isOpen || !selectedDate) return null;

  const dayOfWeek = DAYS_OF_WEEK[selectedDate.getDay()];
  const day = selectedDate.getDate();
  const month = MONTHS[selectedDate.getMonth()];
  const year = selectedDate.getFullYear();

  const isToday = () => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#04010A]/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-md mx-0 md:mx-4 overflow-hidden animate-fadeIn max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-5 md:px-6 pt-5 md:pt-6 pb-4 border-b border-[#E8E0F5]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center ${isToday() ? 'bg-[#6117F4] text-white' : 'bg-[#F3EFFC] text-[#6117F4]'}`}>
                <span className="text-xl md:text-2xl font-bold">{day}</span>
              </div>
              <div>
                <p className="text-sm md:text-base font-semibold text-[#1a1a2e]">
                  {dayOfWeek}
                </p>
                <p className="text-xs md:text-sm text-[#6B7280]">
                  {month} de {year}
                  {isToday() && <span className="ml-2 text-[#6117F4] font-medium">• Hoje</span>}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 md:px-6 py-4">
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F3EFFC] flex items-center justify-center">
                <Calendar className="w-8 h-8 text-[#6117F4]/50" />
              </div>
              <p className="text-[#6B7280] text-sm mb-1">Nenhuma postagem agendada</p>
              <p className="text-[#9CA3AF] text-xs">Clique abaixo para criar uma</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider mb-3">
                {posts.length} {posts.length === 1 ? 'postagem' : 'postagens'}
              </p>
              
              {posts.map((post) => {
                const Icon = contentTypeIcons[post.contentType] || Image;
                const status = statusColors[post.status] || statusColors['Planejado'];
                
                // Suporte para formato novo (account + responsibles) e antigo (owners)
                const displayItems = [];
                
                if (post.account) {
                  const account = getAccountById(post.account);
                  if (account) displayItems.push(account);
                }
                
                if (post.responsibles && post.responsibles.length > 0) {
                  post.responsibles.forEach(id => {
                    const responsible = getResponsibleById(id);
                    if (responsible) displayItems.push(responsible);
                  });
                }
                
                // Fallback para formato antigo
                if (displayItems.length === 0 && post.owners && post.owners.length > 0) {
                  displayItems.push(...getOwnersByIds(post.owners));
                }
                
                return (
                  <button
                    key={post.id}
                    onClick={() => onPostClick(post)}
                    className="w-full text-left bg-[#FAFAFF] hover:bg-[#F3EFFC] border border-[#E8E0F5] rounded-xl p-4 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-[#E8E0F5] flex items-center justify-center flex-shrink-0 group-hover:border-[#C4B5F0] transition-colors">
                        <Icon className="w-5 h-5 text-[#6117F4]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1a1a2e] truncate mb-1">
                          {post.theme}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span 
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium"
                            style={{ backgroundColor: status.bg, color: status.text }}
                          >
                            <span 
                              className="w-1.5 h-1.5 rounded-full" 
                              style={{ backgroundColor: status.dot }}
                            />
                            {post.status}
                          </span>
                          <span className="text-[10px] text-[#6B7280] uppercase">
                            {post.channel}
                          </span>
                        </div>
                        {/* Conta e Responsáveis */}
                        {displayItems.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <div className="flex -space-x-1">
                              {displayItems.slice(0, 3).map((item) => (
                                <div
                                  key={item.id}
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold border-2 border-white"
                                  style={{ backgroundColor: item.color }}
                                  title={item.name}
                                >
                                  {item.initials}
                                </div>
                              ))}
                              {displayItems.length > 3 && (
                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-medium bg-gray-200 text-gray-600 border-2 border-white">
                                  +{displayItems.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {post.description && (
                          <p className="text-xs text-[#6B7280] mt-2 line-clamp-2">
                            {post.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer - Create Button */}
        <div className="px-5 md:px-6 py-4 border-t border-[#E8E0F5] bg-white">
          <button
            onClick={onCreatePost}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#1a1a2e] text-white font-medium rounded-xl hover:bg-[#2d2d4a] transition-all shadow-lg text-sm md:text-base"
          >
            <Plus className="w-5 h-5" />
            Nova Postagem
          </button>
        </div>
      </div>
    </div>
  );
}

export default DayDetailModal;
