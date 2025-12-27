import React, { useState, useEffect } from 'react';
import { X, Target, LayoutGrid, Link2, Calendar as CalendarIcon, Edit3, Trash2, Loader2, Users, Check, ChevronDown, Building2 } from 'lucide-react';
import { ACCOUNTS, RESPONSIBLES } from '../config/owners';

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
    account: '',
    responsibles: [],
  });

  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showResponsiblesDropdown, setShowResponsiblesDropdown] = useState(false);

  useEffect(() => {
    if (editingPost) {
      setFormData({
        theme: editingPost.theme || '',
        contentType: editingPost.contentType || 'Post (Imagem)',
        channel: editingPost.channel || 'Instagram',
        status: editingPost.status || 'Planejado',
        date: editingPost.date || '',
        description: editingPost.description || '',
        account: editingPost.account || '',
        responsibles: editingPost.responsibles || [],
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
        account: '',
        responsibles: [],
      }));
    }
  }, [selectedDate, editingPost]);

  // Fechar dropdowns ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      setShowAccountDropdown(false);
      setShowResponsiblesDropdown(false);
    }
  }, [isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleResponsible = (responsibleId) => {
    setFormData((prev) => ({
      ...prev,
      responsibles: prev.responsibles.includes(responsibleId)
        ? prev.responsibles.filter(id => id !== responsibleId)
        : [...prev.responsibles, responsibleId]
    }));
  };

  const selectAccount = (accountId) => {
    setFormData((prev) => ({
      ...prev,
      account: accountId
    }));
    setShowAccountDropdown(false);
  };

  const toggleAccountDropdown = () => {
    setShowAccountDropdown(!showAccountDropdown);
    setShowResponsiblesDropdown(false);
  };

  const toggleResponsiblesDropdown = () => {
    setShowResponsiblesDropdown(!showResponsiblesDropdown);
    setShowAccountDropdown(false);
  };

  const getSelectedAccount = () => {
    return ACCOUNTS.find(acc => acc.id === formData.account);
  };

  const getSelectedResponsibles = () => {
    return RESPONSIBLES.filter(resp => formData.responsibles.includes(resp.id));
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-[#04010A]/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn flex flex-col max-h-[95vh]">
        {/* Header - Fixo */}
        <div className="px-5 md:px-8 pt-6 md:pt-8 pb-3 md:pb-4 bg-white border-b border-gray-100 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#04010A]">
                {editingPost ? 'Editar Postagem' : 'Nova Postagem'}
              </h2>
              <p className="text-gray-500 text-xs md:text-sm mt-1">
                Planeje seu próximo conteúdo criativo
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* Form com rolagem */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Conteúdo com scroll */}
          <div className="px-5 md:px-8 py-4 md:py-6 overflow-y-auto flex-1">
          {/* Theme */}
          <div className="mb-4 md:mb-5">
            <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
              <Target className="w-4 h-4 text-[#6117F4]" />
              Tema da Postagem
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              placeholder="Ex: Lançamento do novo produto"
              className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6117F4]/30 focus:border-[#6117F4] transition-all text-gray-800 placeholder:text-gray-400 text-sm md:text-base"
            />
          </div>

          {/* Content Type and Channel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-5">
            <div>
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                <LayoutGrid className="w-4 h-4 text-[#6117F4]" />
                Tipo de Conteúdo
              </label>
              <div className="relative">
                <select
                  value={formData.contentType}
                  onChange={(e) => handleChange('contentType', e.target.value)}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6117F4]/30 focus:border-[#6117F4] transition-all text-gray-800 appearance-none bg-white cursor-pointer text-sm md:text-base"
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
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                <Link2 className="w-4 h-4 text-[#6117F4]" />
                Canal
              </label>
              <div className="relative">
                <select
                  value={formData.channel}
                  onChange={(e) => handleChange('channel', e.target.value)}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6117F4]/30 focus:border-[#6117F4] transition-all text-gray-800 appearance-none bg-white cursor-pointer text-sm md:text-base"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-5">
            <div>
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                Status
              </label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6117F4]/30 focus:border-[#6117F4] transition-all text-gray-800 appearance-none bg-white cursor-pointer text-sm md:text-base"
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
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                <CalendarIcon className="w-4 h-4 text-[#6117F4]" />
                Data da Publicação
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6117F4]/30 focus:border-[#6117F4] transition-all text-gray-800 placeholder:text-gray-400 text-sm md:text-base"
              />
            </div>
          </div>

          {/* Conta (Dropdown) */}
          <div className="mb-4 md:mb-5">
            <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
              <Building2 className="w-4 h-4 text-[#6117F4]" />
              Conta
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={toggleAccountDropdown}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6117F4]/30 focus:border-[#6117F4] transition-all text-gray-800 bg-white cursor-pointer text-sm md:text-base flex items-center justify-between"
              >
                {getSelectedAccount() ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ backgroundColor: getSelectedAccount().color }}
                    >
                      {getSelectedAccount().initials}
                    </div>
                    <span>{getSelectedAccount().name}</span>
                  </div>
                ) : (
                  <span className="text-gray-400">Selecione uma conta</span>
                )}
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showAccountDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showAccountDropdown && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {ACCOUNTS.map((account) => (
                    <button
                      key={account.id}
                      type="button"
                      onClick={() => selectAccount(account.id)}
                      className={`w-full px-3 md:px-4 py-2.5 text-left hover:bg-[#F3EFFC] transition-colors flex items-center gap-2 ${
                        formData.account === account.id ? 'bg-[#F3EFFC]' : ''
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ backgroundColor: account.color }}
                      >
                        {account.initials}
                      </div>
                      <span className="text-sm md:text-base">{account.name}</span>
                      {formData.account === account.id && (
                        <Check className="w-4 h-4 text-[#6117F4] ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Responsáveis (Dropdown com seleção múltipla) */}
          <div className="mb-4 md:mb-5">
            <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
              <Users className="w-4 h-4 text-[#6117F4]" />
              Responsáveis
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={toggleResponsiblesDropdown}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6117F4]/30 focus:border-[#6117F4] transition-all text-gray-800 bg-white cursor-pointer text-sm md:text-base flex items-center justify-between"
              >
                {getSelectedResponsibles().length > 0 ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    {getSelectedResponsibles().map((resp) => (
                      <div key={resp.id} className="flex items-center gap-1 bg-[#F3EFFC] px-2 py-1 rounded-lg">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                          style={{ backgroundColor: resp.color }}
                        >
                          {resp.initials}
                        </div>
                        <span className="text-xs">{resp.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">Selecione os responsáveis</span>
                )}
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showResponsiblesDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showResponsiblesDropdown && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {RESPONSIBLES.map((responsible) => {
                    const isSelected = formData.responsibles.includes(responsible.id);
                    return (
                      <button
                        key={responsible.id}
                        type="button"
                        onClick={() => toggleResponsible(responsible.id)}
                        className={`w-full px-3 md:px-4 py-2.5 text-left hover:bg-[#F3EFFC] transition-colors flex items-center gap-2 ${
                          isSelected ? 'bg-[#F3EFFC]' : ''
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                          style={{ backgroundColor: responsible.color }}
                        >
                          {responsible.initials}
                        </div>
                        <span className="text-sm md:text-base">{responsible.name}</span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#6117F4] ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {formData.responsibles.length === 0 && (
              <p className="text-xs text-gray-400 mt-1.5">Selecione um ou mais responsáveis</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-5 md:mb-6">
            <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
              <Edit3 className="w-4 h-4 text-[#6117F4]" />
              Legenda / Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Digite o texto completo da postagem, legenda, observações..."
              rows={3}
              className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6117F4]/30 focus:border-[#6117F4] transition-all text-gray-800 placeholder:text-gray-400 resize-none text-sm md:text-base"
            />
          </div>
          </div>

          {/* Actions - Footer fixo */}
          <div className="px-5 md:px-8 py-4 md:py-5 bg-white border-t border-gray-100 flex-shrink-0">
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Delete button - only show when editing */}
            <div>
              {editingPost && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 md:py-3 text-red-500 font-medium hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="flex-1 sm:flex-none px-4 md:px-6 py-2.5 md:py-3 text-gray-600 font-medium hover:text-gray-800 transition-colors disabled:opacity-50 text-sm md:text-base"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 md:px-8 py-2.5 md:py-3 bg-[#6117F4] text-white font-medium rounded-xl hover:bg-[#4903B4] transition-colors shadow-lg shadow-[#6117F4]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostModal;
