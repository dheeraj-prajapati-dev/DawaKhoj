import { useState, useEffect } from 'react';
import { getMyInventory } from '../services/inventory.service';

export const useInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      const res = await getMyInventory();   
      setInventory(res.data.inventory);
    } catch (error) {
      console.error('❌ Inventory fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return { inventory, loading, fetchInventory };
};
