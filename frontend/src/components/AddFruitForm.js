import React, { useState } from 'react';
import { useFruit } from '../context/FruitContext';

const AddFruitForm = ({ onClose }) => {
  const { addFruit } = useFruit();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: '',
    stock: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addFruit({
        name: formData.name.trim(),
        type: formData.type.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });
      
      console.log('✅ Fruit added successfully!');
      onClose(); // Close modal on success
      
      // Reset form
      setFormData({
        name: '',
        type: '',
        price: '',
        stock: ''
      });
    } catch (error) {
      console.error('❌ Error adding fruit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '2px solid #e9ecef',
    borderRadius: '6px',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s'
  };

  const focusStyle = {
    borderColor: '#007bff',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px'
  };

  const buttonStyle = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginRight: '10px',
    transition: 'background-color 0.3s'
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>🏷️ Fruit Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Apple, Banana, Mango"
          required
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = '#007bff'}
          onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>📂 Type:</label>
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="e.g., Fruit, Vegetable"
          required
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = '#007bff'}
          onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>💰 Price (₱):</label>
        <input
          type="number"
          step="0.01"
          min="0"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="0.00"
          required
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = '#007bff'}
          onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
        />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <label style={labelStyle}>📦 Initial Stock:</label>
        <input
          type="number"
          min="0"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="0"
          required
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = '#007bff'}
          onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          style={{
            ...buttonStyle,
            backgroundColor: '#6c757d',
            color: 'white'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
        >
          ❌ Cancel
        </button>
        
        <button 
          type="submit"
          disabled={isSubmitting}
          style={{
            ...buttonStyle,
            backgroundColor: isSubmitting ? '#ccc' : '#28a745',
            color: 'white',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
          onMouseOver={(e) => {
            if (!isSubmitting) e.target.style.backgroundColor = '#218838';
          }}
          onMouseOut={(e) => {
            if (!isSubmitting) e.target.style.backgroundColor = '#28a745';
          }}
        >
          {isSubmitting ? '⏳ Adding...' : '✅ Add Fruit'}
        </button>
      </div>
    </form>
  );
};

export default AddFruitForm;