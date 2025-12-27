import React, { useState, useCallback, useEffect } from 'react';
import { Navbar, Calendar, Analytics, PostModal, Login, DayDetailModal } from './components';
import { fetchPosts, createPost, updatePost, deletePost } from './services/postsService';
import { onAuthChange, logout } from './services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('calendario');
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDayDetailOpen, setIsDayDetailOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [ownerFilter, setOwnerFilter] = useState([]);

  // Observar estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Carregar posts do Firebase ao iniciar (apenas se logado)
  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const postsData = await fetchPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (loggedUser) => {
    setUser(loggedUser);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setPosts([]);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleDayClick = useCallback((date) => {
    setSelectedDate(date);
    setEditingPost(null);
    setIsDayDetailOpen(true);
  }, []);

  const handleCloseDayDetail = useCallback(() => {
    setIsDayDetailOpen(false);
  }, []);

  const handleCreatePost = useCallback(() => {
    setSelectedDate(new Date());
    setEditingPost(null);
    setIsModalOpen(true);
  }, []);

  const handleCreatePostFromDay = useCallback(() => {
    // Fecha o modal de detalhe do dia e abre o modal de criação
    setIsDayDetailOpen(false);
    setEditingPost(null);
    setIsModalOpen(true);
  }, []);

  const handlePostClick = useCallback((post) => {
    setIsDayDetailOpen(false);
    setEditingPost(post);
    setSelectedDate(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setEditingPost(null);
  }, []);

  const handleSavePost = useCallback(async (postData) => {
    try {
      setIsSaving(true);
      
      if (editingPost) {
        // Atualizar post existente
        const updatedPost = await updatePost(editingPost.id, postData);
        setPosts((prevPosts) =>
          prevPosts.map((p) => (p.id === editingPost.id ? updatedPost : p))
        );
      } else {
        // Criar novo post
        const newPost = await createPost(postData);
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar post:', error);
      alert('Erro ao salvar post. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  }, [editingPost, handleCloseModal]);

  const handleDeletePost = useCallback(async (postId) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    
    try {
      setIsSaving(true);
      await deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao deletar post:', error);
      alert('Erro ao deletar post. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  }, [handleCloseModal]);

  // Tela de loading inicial
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img 
            src="/LOGO SYSTEMS ROXO.png" 
            alt="Logo" 
            className="h-16 w-auto animate-pulse"
          />
          <p className="text-[#6B7280] text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  // Tela de login
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Nome fixo do usuário
  const userName = 'Grupo Nexus';

  // Filtrar posts por responsável (múltiplos)
  const filteredPosts = ownerFilter.length > 0
    ? posts.filter((post) => {
        // Suporta novo formato (account + responsibles) e antigo (owners)
        const allIds = [];
        if (post.account) allIds.push(post.account);
        if (post.responsibles) allIds.push(...post.responsibles);
        if (post.owners) allIds.push(...post.owners);
        return allIds.some(id => ownerFilter.includes(id));
      })
    : posts;

  // Filtrar posts do dia selecionado (já com filtro de responsável aplicado)
  const getPostsForSelectedDate = () => {
    if (!selectedDate) return [];
    return filteredPosts.filter((post) => {
      const [day, month, year] = post.date.split('/');
      const postDate = new Date(year, month - 1, day);
      return (
        postDate.getDate() === selectedDate.getDate() &&
        postDate.getMonth() === selectedDate.getMonth() &&
        postDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex flex-col">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={userName}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 pt-16 md:pt-20">
        {activeTab === 'calendario' ? (
          <Calendar
            posts={filteredPosts}
            onDayClick={handleDayClick}
            onPostClick={handlePostClick}
            onCreatePost={handleCreatePost}
            isLoading={isLoading}
            ownerFilter={ownerFilter}
            onOwnerFilterChange={setOwnerFilter}
          />
        ) : (
          <Analytics />
        )}
      </main>

      {/* Day Detail Modal */}
      <DayDetailModal
        isOpen={isDayDetailOpen}
        onClose={handleCloseDayDetail}
        selectedDate={selectedDate}
        posts={getPostsForSelectedDate()}
        onPostClick={handlePostClick}
        onCreatePost={handleCreatePostFromDay}
      />

      {/* Post Modal */}
      <PostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePost}
        onDelete={handleDeletePost}
        selectedDate={selectedDate}
        editingPost={editingPost}
        isSaving={isSaving}
      />
    </div>
  );
}

export default App;