import React, { useState, useCallback, useEffect } from 'react';
import { Navbar, Calendar, Analytics, PostModal, Login } from './components';
import { fetchPosts, createPost, updatePost, deletePost } from './services/postsService';
import { onAuthChange, logout } from './services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('calendario');
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
    setIsModalOpen(true);
  }, []);

  const handleCreatePost = useCallback(() => {
    setSelectedDate(new Date());
    setEditingPost(null);
    setIsModalOpen(true);
  }, []);

  const handlePostClick = useCallback((post) => {
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
      <main className="flex-1 pt-20">
        {activeTab === 'calendario' ? (
          <Calendar
            posts={posts}
            onDayClick={handleDayClick}
            onPostClick={handlePostClick}
            onCreatePost={handleCreatePost}
            isLoading={isLoading}
          />
        ) : (
          <Analytics />
        )}
      </main>

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