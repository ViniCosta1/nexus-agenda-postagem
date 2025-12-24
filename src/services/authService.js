import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  browserSessionPersistence,
  setPersistence
} from 'firebase/auth';
import { auth } from '../../config/firebase';

/**
 * Faz login com email e senha
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} Usuário autenticado
 */
export const loginWithEmail = async (email, password) => {
  try {
    // Configura persistência por sessão do navegador
    await setPersistence(auth, browserSessionPersistence);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

/**
 * Faz logout do usuário
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};

/**
 * Observa mudanças no estado de autenticação
 * @param {Function} callback - Função chamada quando o estado muda
 * @returns {Function} Função para cancelar a observação
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
