import React, { createContext, useContext, useReducer } from 'react';
import axios from 'axios';

const FruitContext = createContext();

// TODO: Update this URL with your actual API port from Visual Studio
// Look in VS output for: "Now listening on: https://localhost:XXXX"
const API_BASE_URL = 'https://localhost:7017/api'; // Change 7139 to your port!

const fruitReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FRUITS':
      return { ...state, fruits: action.payload, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const useFruit = () => {
  const context = useContext(FruitContext);
  if (!context) {
    throw new Error('useFruit must be used within a FruitProvider');
  }
  return context;
};

export const FruitProvider = ({ children }) => {
  const [state, dispatch] = useReducer(fruitReducer, {
    fruits: [],
    loading: false,
    error: null
  });

  const fetchFruits = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      console.log('🔍 Fetching fruits from:', `${API_BASE_URL}/fruits`);
      const response = await axios.get(`${API_BASE_URL}/fruits`);
      console.log('✅ API Response:', response.data);
      dispatch({ type: 'SET_FRUITS', payload: response.data });
    } catch (error) {
      console.error('❌ API Error:', error.response?.data || error.message);
      dispatch({ type: 'SET_ERROR', payload: `Failed to fetch fruits: ${error.message}` });
    }
  };

  const addFruit = async (fruit) => {
    try {
      console.log('➕ Adding fruit:', fruit);
      await axios.post(`${API_BASE_URL}/fruits`, fruit);
      await fetchFruits(); // Refresh the list
      console.log('✅ Fruit added successfully');
    } catch (error) {
      console.error('❌ Add Error:', error.response?.data || error.message);
      dispatch({ type: 'SET_ERROR', payload: `Failed to add fruit: ${error.message}` });
    }
  };

  const updateFruit = async (id, fruit) => {
    try {
      console.log('📝 Updating fruit:', id, fruit);
      await axios.put(`${API_BASE_URL}/fruits/${id}`, fruit);
      await fetchFruits(); // Refresh the list
      console.log('✅ Fruit updated successfully');
    } catch (error) {
      console.error('❌ Update Error:', error.response?.data || error.message);
      dispatch({ type: 'SET_ERROR', payload: `Failed to update fruit: ${error.message}` });
    }
  };

  return (
    <FruitContext.Provider value={{
      ...state,
      fetchFruits,
      addFruit,
      updateFruit
    }}>
      {children}
    </FruitContext.Provider>
  );
};