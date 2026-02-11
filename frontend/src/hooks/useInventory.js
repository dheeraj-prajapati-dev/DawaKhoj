import { useState, useEffect } from 'react';
import { API } from '../context/AuthContext'; 
import { toast } from 'react-hot-toast';

export const useInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      // 🔥 CORRECTED URL: Backend route '/my' hai
      const res = await API.get('/inventory/my'); 
      
      if (res.data && res.data.success) {
        // Backend 'inventory' key ke andar array bhej raha hai
        setInventory(res.data.inventory); 
      }
    } catch (error) {
      console.error('❌ Inventory fetch error:', error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Inventory load nahi ho payi");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return { inventory, loading, fetchInventory };
};