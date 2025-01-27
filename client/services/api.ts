import axios from 'axios';

// Configuration de l'instance Axios
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // URL de base du backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs globales
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
);

// Fonctions pour interagir avec le backend

/**
 * Connexion de l'utilisateur
 */
export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/api/auth/login', { email, password });
  return response.data;
};

/**
 * Inscription de l'utilisateur
 */
export const signup = async (username: string, email: string, password: string) => {
  const response = await apiClient.post('/api/auth/signup', { username, email, password });
  return response.data;
};

/**
 * Récupérer les transactions de l'utilisateur
 */
export const fetchTransactions = async () => {
  const response = await apiClient.get('/api/transactions/');
  return response.data;
};

/**
 * Récupérer les récurrences de l'utilisateur
 */
export const fetchRecurrences = async () => {
  const response = await apiClient.get('/api/recurrences/');
  return response.data;
};

/**
 * Récupérer le budget de l'utilisateur
 */
export const fetchBudgets = async () => {
  const response = await apiClient.get('/api/budgets/');
  return response.data;
};

/**
 * Créer un nouveau budget
 */
export const createBudget = async (data: { initialAmount: number }) => {
  try {
    const response = await apiClient.put('/api/budgets/', data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du budget:', error);
    throw error;
  }
};

/**
 * Créer une nouvelle transaction
 */
export const createTransaction = async (data: {
  name: string;
  amount: number;
  date: string; // Date au format ISO 8601
  type: string;
  categoryId: string; // Utilisez 'categoryId'
}) => {
  const response = await apiClient.post('/api/transactions/', data);
  return response.data;
};

/**
 * Modifier une transaction
 */
export const updateTransaction = async (id: string, data: {
  name: string;
  amount: number;
  date: string; // Date au format ISO 8601
  type: string;
  categoryId: string;
}) => {
  try {
    const response = await apiClient.put(`/api/transactions/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la transaction:', error);
    throw error;
  }
};

/**
 * Supprimer une transaction
 */
export const deleteTransaction = async (id: string) => {
  const response = await apiClient.delete(`/api/transactions/${id}`);
  return response.data;
};

/**
 * Récupérer les catégories de l'utilisateur
 */
export const fetchCategories = async () => {
  const response = await apiClient.get('/api/categories/');
  return response.data;
};

/**
 * Créer une nouvelle catégorie
 */
export const createCategory = async (data: { name: string }) => {
  const response = await apiClient.post('/api/categories/', data);
  return response.data;
};

/**
 * Modifier une catégorie
 */
export const updateCategory = async (id: string, data: { name: string }) => {
  const response = await apiClient.put(`/api/categories/${id}`, data);
  return response.data;
};

/**
 * Supprimer une catégorie
 */
export const deleteCategory = async (id: string) => {
  const response = await apiClient.delete(`/api/categories/${id}`);
  return response.data;
};

/**
 * Récupérer les objectifs de l'utilisateur
 */
export const fetchGoals = async () => {
  const response = await apiClient.get('/api/goals/');
  return response.data;
};

/**
 * Récupérer les statistiques de l'utilisateur
 */
export const fetchStatistics = async () => {
  const response = await apiClient.get('/api/statistics/budget-summary/');
  return response.data;
};

/**
 * Créer une nouvelle récurrence
 */
export const createRecurrence = async (data: {
  name: string;
  frequency: string; // Fréquence de la récurrence (daily, weekly, monthly, yearly)
  startDate: string; // Date de début au format ISO 8601
  endDate: string; // Date de fin au format ISO 8601
  amount: number; // Montant de la récurrence
  type: string; // Type de récurrence (income ou expense)
  categoryId: string; // ID de la catégorie
}) => {
  const response = await apiClient.post('/api/recurrences/', data);
  return response.data;
};

/**
 * Modifier une récurrence
 */
export const updateRecurrence = async (id: string, data: {
  name: string;
  frequency: string; // Fréquence de la récurrence (daily, weekly, monthly, yearly)
  startDate: string; // Date de début au format ISO 8601
  endDate: string; // Date de fin au format ISO 8601
  amount: number; // Montant de la récurrence
  type: string; // Type de récurrence (income ou expense)
  categoryId: string; // ID de la catégorie
}) => {
  try {
    const response = await apiClient.put(`/api/recurrences/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la récurrence:', error);
    throw error;
  }
};

/**
 * Supprimer une récurrence
 */
export const deleteRecurrence = async (id: string) => {
  const response = await apiClient.delete(`/api/recurrences/${id}`);
  return response.data;
};


// Créer un nouvel objectif
export const createGoal = async (data: {
  name: string;
  targetAmount: number;
  deadline: string; // Date au format ISO 8601
  budgetId: string; // ID du budget associé
}) => {
  const response = await apiClient.post('/api/goals/', data);
  return response.data;
};

/**
 * Supprimer un obdjectif
 */
export const updateGoal = async (id: string, data: {
  name: string;
  targetAmount: number;
  deadline: string; // Date au format ISO 8601
  budgetId: string; // ID du budget associé
}) => {
  try {
    const response = await apiClient.put(`/api/goals/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'objectif:', error);
    throw error;
  }
};

/**
 * Supprimer un obdjectif
 */
export const deleteGoal = async (id: string) => {
  const response = await apiClient.delete(`/api/goals/${id}`);
  return response.data;
};