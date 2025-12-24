import React, { useState, useEffect } from 'react';
import { X, Target, LayoutGrid, Link2, Calendar as CalendarIcon, Edit3, Trash2, Loader2 } from 'lucide-react';

const contentTypes = ['Post (Imagem)', 'Reel (Vídeo)', 'Story', 'Carrossel'];
const channels = ['Instagram', 'LinkedIn', 'YouTube', 'TikTok'];
const statuses = ['Planejado', 'Em Produção', 'Em Revisão', 'Aprovado', 'Postado'];

function PostModal({ isOpen, onClose, onSave, onDelete, selectedDate, editingPost, isSaving }) {
  const [formData, setFormData] = useState({
    theme: '',
    contentType: 'Post (Imagem)',
    channel: 'Instagram',
    status: 'Planejado',
    date: '',
    description: '',
  });

  useEffect(() => {
    if (editingPost) {
      setFormData({
        theme: editingPost.theme || '',
        contentType: editingPost.contentType || 'Post (Imagem)',
        channel: editingPost.channel || 'Instagram',
        status: editingPost.status || 'Planejado',
        date: editingPost.date || '',
        description: editingPost.description || '',
      });
    } else if (selectedDate) {
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      setFormData((prev) => ({
        ...prev,
        theme: '',
        contentType: 'Post (Imagem)',
        channel: 'Instagram',
        status: 'Planejado',
        date: `${day}/${month}/${year}`,
        description: '',
      }));
    }
  }, [selectedDate, editingPost]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.theme.trim() || isSaving) return;
    
    onSave({
      ...formData,
    });
  };

  const handleDelete = () => {
    if (editingPost && onDelete) {
      onDelete(editingPost.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-[#04010A]/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#04010A]">
                {editingPost ? 'Editar Postagem' : 'Nova Postagem'}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Planeje seu próximo conteúdo criativo
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8">
          {/* Theme */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4 text-[#6117F4]" />
              Tema da Postagem
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              placeholder="Ex: Lançamento do novo produto"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6117F4]/30 focus:border-[#6117F4] transition-all text-gray-800 placeholder:text-gray-400"
            />
          </div>

          {/* Content Type and Channel */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <LayoutGrid className="w-4 h-4 text-[#6117F4]" />
                Tipo de Conteúdo
              </label>
              <div className="relative">
                <select
                  value={formData.contentType}
                  onChange={(e) => handleChange('contentType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6117F4]/30 focus:border-[#6117F4] transition-all text-gray-800 appearance-none bg-white cursor-pointer"
                >
                  {contentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Link2 className="w-4 h-4 text-[#6117F4]" />
                Canal
              </label>
              <div className="relative">
                <select
                  value={formData.channel}
                  onChange={(e) => handleChange('channel', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6117F4]/30 focus:border-[#6117F4] transition-all text-gray-800 appearance-none bg-white cursor-pointer"
                >
                  {channels.map((channel) => (
                    <option key={channel} value={channel}>
                      {channel}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Date */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6117F4]/30 focus:border-[#6117F4] transition-all text-gray-800 appearance-none bg-white cursor-pointer"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <CalendarIcon className="w-4 h-4 text-[#6117F4]" />
                Data da Publicação
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6117F4]/30 focus:border-[#6117F4] transition-all text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Edit3 className="w-4 h-4 text-[#6117F4]" />
              Legenda / Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Digite o texto completo da postagem, legenda, observações..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6117F4]/30 focus:border-[#6117F4] transition-all text-gray-800 placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            {/* Delete button - only show when editing */}
            <div>
              {editingPost && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-3 text-red-500 font-medium hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-6 py-3 text-gray-600 font-medium hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-3 bg-[#6117F4] text-white font-medium rounded-xl hover:bg-[#4903B4] transition-colors shadow-lg shadow-[#6117F4]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSaving ? 'Salvando...' : 'Salvar Postagem'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostModal;
