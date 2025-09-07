import React, { useEffect, useState } from 'react';
import { useFruit } from '../context/FruitContext';
import AddFruitForm from './AddFruitForm';
import UpdateFruitForm from './UpdateFruitForm';

const FruitInventory = () => {
  const { fruits, loading, error, fetchFruits } = useFruit();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedFruit, setSelectedFruit] = useState(null);

  // DEBUG: Log everything on every render
  console.log('🔄 RENDER - Loading:', loading, 'Fruits:', fruits, 'Error:', error);

 
  useEffect(() => {
    console.log('🚀 useEffect triggered - calling fetchFruits');
    fetchFruits();
  }, []); 

  const handleUpdate = (fruit) => {
    console.log('Opening update modal for:', fruit);
    setSelectedFruit(fruit);
    setShowUpdateModal(true);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* DEBUG INFO */}
      <div style={{ 
      }}>
      </div>

      <h1>FRUIT INVENTORY SYSTEM</h1>

      {/* ALWAYS SHOW FRUITS IF THEY EXIST */}
      {fruits && fruits.length > 0 && (
        <div>
          <h2>FRUITS FOUND: {fruits.length}</h2>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            border: '1px solid #ddd'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Type</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Price</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Stock</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fruits.map((fruit) => (
                <tr key={fruit.fruitID}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{fruit.fruitID}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{fruit.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{fruit.type}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>₱{fruit.price.toFixed(2)}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{fruit.stock}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <button 
                      onClick={() => handleUpdate(fruit)}
                      style={{ 
                        backgroundColor: '#ffc107', 
                        border: 'none', 
                        padding: '5px 10px',
                        cursor: 'pointer'
                      }}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ERROR DISPLAY */}
      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          padding: '20px', 
          margin: '20px 0',
          border: '1px solid #f5c6cb'
        }}>
          <h3> Error</h3>
          <p>{error}</p>
        </div>
      )}

      {/* NO FRUITS */}
      {!loading && !error && (!fruits || fruits.length === 0) && (
        <div style={{ 
          backgroundColor: '#d1ecf1', 
          padding: '20px', 
          margin: '20px 0',
          border: '1px solid #bee5eb'
        }}>
          <h3>No Fruits Found</h3>
          <p>No fruits available in the inventory.</p>
        </div>
      )}

      {/* ADD BUTTON */}
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
          margin: '20px 0'
        }}
      > Add New Fruit
      </button>

      {/* MODALS */}
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
            maxWidth: '500px'
          }}>
            <h2> ADD NEW FRUIT</h2>
            <AddFruitForm onClose={() => setShowAddModal(false)} />
            <button 
              onClick={() => setShowAddModal(false)}
              style={{ 
                backgroundColor: '#6c757d', 
                color: 'white', 
                border: 'none', 
                padding: '10px 20px',
                marginTop: '10px'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

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
            maxWidth: '500px'
          }}>
            <h2>UPDATE FRUIT</h2>
            <UpdateFruitForm 
              fruit={selectedFruit} 
              onClose={() => setShowUpdateModal(false)} 
            />
            <button 
              onClick={() => setShowUpdateModal(false)}
              style={{ 
                backgroundColor: '#6c757d', 
                color: 'white', 
                border: 'none', 
                padding: '10px 20px',
                marginTop: '10px'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FruitInventory;