import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';

const COLLECTION_NAME = 'posts';

/**
 * Busca todos os posts do Firestore
 * @returns {Promise<Array>} Lista de posts
 */
export const fetchPosts = async () => {
  try {
    const postsRef = collection(db, COLLECTION_NAME);
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return posts;
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    throw error;
  }
};

/**
 * Cria um novo post no Firestore
 * @param {Object} postData - Dados do post
 * @returns {Promise<Object>} Post criado com ID
 */
export const createPost = async (postData) => {
  try {
    const postsRef = collection(db, COLLECTION_NAME);
    
    const newPost = {
      theme: postData.theme,
      contentType: postData.contentType,
      channel: postData.channel,
      status: postData.status,
      date: postData.date,
      description: postData.description || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(postsRef, newPost);
    
    return {
      id: docRef.id,
      ...newPost
    };
  } catch (error) {
    console.error('Erro ao criar post:', error);
    throw error;
  }
};

/**
 * Atualiza um post existente no Firestore
 * @param {string} postId - ID do post
 * @param {Object} postData - Dados atualizados do post
 * @returns {Promise<Object>} Post atualizado
 */
export const updatePost = async (postId, postData) => {
  try {
    const postRef = doc(db, COLLECTION_NAME, postId);
    
    const updatedPost = {
      theme: postData.theme,
      contentType: postData.contentType,
      channel: postData.channel,
      status: postData.status,
      date: postData.date,
      description: postData.description || '',
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(postRef, updatedPost);
    
    return {
      id: postId,
      ...updatedPost
    };
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    throw error;
  }
};

/**
 * Deleta um post do Firestore
 * @param {string} postId - ID do post
 * @returns {Promise<void>}
 */
export const deletePost = async (postId) => {
  try {
    const postRef = doc(db, COLLECTION_NAME, postId);
    await deleteDoc(postRef);
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    throw error;
  }
};
