import React, { useState } from 'react';
import { useFruit } from '../context/FruitContext';

const UpdateFruitForm = ({ fruit, onClose }) => {
  const { updateFruit } = useFruit();
  const [formData, setFormData] = useState({
    name: fruit.name,
    type: fruit.type,
    price: fruit.price.toString(),
    stock: fruit.stock.toString()
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
      await updateFruit(fruit.fruitID, {
        name: formData.name.trim(),
        type: formData.type.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });
      
      console.log('Fruit updated successfully!');
      onClose(); // Close modal on success
    } catch (error) {
      console.error('❌ Error updating fruit:', error);
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
    <div>
      {/* Current Info Display */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '6px',
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Current Information:</h4>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          <strong>ID:</strong> {fruit.fruitID} | 
          <strong> Current Stock:</strong> {fruit.stock} units | 
          <strong> Current Price:</strong> ₱{fruit.price.toFixed(2)}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Fruit Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#ffc107'}
            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Type:</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#ffc107'}
            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Price (₱):</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#ffc107'}
            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={labelStyle}>Stock Quantity:</label>
          <input
            type="number"
            min="0"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#ffc107'}
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
            Cancel
          </button>
          
          <button 
            type="submit"
            disabled={isSubmitting}
            style={{
              ...buttonStyle,
              backgroundColor: isSubmitting ? '#ccc' : '#ffc107',
              color: '#212529',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
            onMouseOver={(e) => {
              if (!isSubmitting) e.target.style.backgroundColor = '#e0a800';
            }}
            onMouseOut={(e) => {
              if (!isSubmitting) e.target.style.backgroundColor = '#ffc107';
            }}
          >
            {isSubmitting ? 'Updating...' : 'Update Fruit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateFruitForm;