import React, { useEffect, useState } from 'react';
import { useFruit } from '../context/FruitContext';
import AddFruitForm from './AddFruitForm';
import UpdateFruitForm from './UpdateFruitForm';

const FruitInventory = () => {
  const { fruits, loading, error, fetchFruits } = useFruit();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedFruit, setSelectedFruit] = useState(null);

  useEffect(() => {
    console.log('🚀 FruitInventory component mounted');
    fetchFruits();
  }, []);

  const handleUpdate = (fruit) => {
    console.log('📝 Opening update modal for:', fruit);
    setSelectedFruit(fruit);
    setShowUpdateModal(true);
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        fontSize: '18px',
        color: '#666'
      }}>
        <div>🔄 Loading fruits...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ 
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <h3>❌ Error!</h3>
          <p>{error}</p>
        </div>
        <button 
          onClick={fetchFruits}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🔄 Try Again
        </button>
      </div>
    );
  }

  // Main component
  return (
    <div style={{ 
      padding: '30px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center',
        marginBottom: '30px',
        borderBottom: '3px solid #007bff',
        paddingBottom: '15px'
      }}>
        <h1 style={{ 
          color: '#333',
          margin: '0',
          fontSize: '2.5rem'
        }}>
          🍎 FRUIT INVENTORY SYSTEM
        </h1>
        <p style={{ 
          color: '#666',
          fontSize: '18px',
          margin: '10px 0 0 0'
        }}>
          Total fruits in inventory: {fruits.length}
        </p>
      </div>
      
      {/* Add Button */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{ 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            padding: '12px 24px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          ➕ Add New Fruit
        </button>
      </div>

      {/* Fruits Table */}
      {fruits.length === 0 ? (
        <div style={{ 
          backgroundColor: '#d1ecf1', 
          color: '#0c5460',
          padding: '20px', 
          borderRadius: '5px',
          textAlign: 'center',
          fontSize: '18px'
        }}>
          <p>📦 No fruits in inventory yet!</p>
          <p>Click "Add New Fruit" to get started.</p>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ 
                backgroundColor: '#007bff',
                color: 'white'
              }}>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px' }}>ID</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px' }}>🏷️ Name</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px' }}>📂 Type</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px' }}>💰 Price</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px' }}>📦 Stock</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '16px' }}>⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {fruits.map((fruit, index) => (
                <tr key={fruit.fruitID} style={{ 
                  backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                  borderBottom: '1px solid #dee2e6'
                }}>
                  <td style={{ padding: '12px', fontSize: '14px' }}>{fruit.fruitID}</td>
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold' }}>{fruit.name}</td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>{fruit.type}</td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#28a745', fontWeight: 'bold' }}>
                    ₱{fruit.price.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    <span style={{
                      backgroundColor: fruit.stock > 20 ? '#d4edda' : fruit.stock > 0 ? '#fff3cd' : '#f8d7da',
                      color: fruit.stock > 20 ? '#155724' : fruit.stock > 0 ? '#856404' : '#721c24',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {fruit.stock} units
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleUpdate(fruit)}
                      style={{ 
                        backgroundColor: '#ffc107', 
                        color: '#212529',
                        border: 'none', 
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      📝 Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '30px', 
            borderRadius: '10px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ 
              marginTop: 0, 
              marginBottom: '20px',
              color: '#333',
              borderBottom: '2px solid #28a745',
              paddingBottom: '10px'
            }}>
              ➕ ADD NEW FRUIT
            </h2>
            <AddFruitForm onClose={() => setShowAddModal(false)} />
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && selectedFruit && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '30px', 
            borderRadius: '10px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ 
              marginTop: 0, 
              marginBottom: '20px',
              color: '#333',
              borderBottom: '2px solid #ffc107',
              paddingBottom: '10px'
            }}>
              📝 UPDATE FRUIT: {selectedFruit.name}
            </h2>
            <UpdateFruitForm 
              fruit={selectedFruit} 
              onClose={() => setShowUpdateModal(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FruitInventory;