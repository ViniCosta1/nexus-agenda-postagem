import React from 'react';
import { Image, Video, CircleDot, LayoutGrid } from 'lucide-react';
import { getOwnersByIds, getAccountById, getResponsibleById } from '../config/owners';

const contentTypeIcons = {
  'Post (Imagem)': Image,
  'Reel (Vídeo)': Video,
  'Story': CircleDot,
  'Carrossel': LayoutGrid,
};

const statusColors = {
  'Planejado': '#9CA3AF',
  'Em Produção': '#F59E0B',
  'Em Revisão': '#8B5CF6',
  'Aprovado': '#10B981',
  'Postado': '#6366F1',
};

function PostCard({ post, onClick }) {
  const Icon = contentTypeIcons[post.contentType] || Image;
  const statusColor = statusColors[post.status] || '#9CA3AF';

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
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick(post);
      }}
      className="bg-white border border-[#E8E0F5] rounded-md p-2 mb-1 cursor-pointer hover:bg-[#F9F7FE] hover:border-[#C4B5F0] transition-all duration-200 group shadow-sm"
    >
      <div className="flex items-center gap-1.5">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: statusColor }}
        />
        <p className="text-[#1a1a2e] text-[10px] font-medium truncate flex-1">
          {post.theme}
        </p>
      </div>
      <div className="flex items-center gap-1 mt-1">
        <Icon className="w-3 h-3 text-[#6117F4]/60" />
        <span className="text-[8px] text-[#6B7280] uppercase">{post.channel}</span>
        {/* Mini avatares da conta e responsáveis */}
        {displayItems.length > 0 && (
          <div className="flex -space-x-1 ml-auto">
            {displayItems.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[6px] font-bold border border-white"
                style={{ backgroundColor: item.color }}
                title={item.name}
              >
                {item.initials.charAt(0)}
              </div>
            ))}
            {displayItems.length > 2 && (
              <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[6px] font-medium bg-gray-200 text-gray-600 border border-white">
                +{displayItems.length - 2}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostCard;
