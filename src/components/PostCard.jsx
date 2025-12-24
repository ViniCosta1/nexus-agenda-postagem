import React from 'react';
import { Image, Video, CircleDot, LayoutGrid, Linkedin, Youtube, Instagram } from 'lucide-react';

const contentTypeIcons = {
  'Post (Imagem)': Image,
  'Reel (Vídeo)': Video,
  'Story': CircleDot,
  'Carrossel': LayoutGrid,
};

const channelColors = {
  'LinkedIn': '#0A66C2',
  'YouTube': '#FF0000',
  'Instagram': '#E4405F',
  'TikTok': '#000000',
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
      </div>
    </div>
  );
}

export default PostCard;
