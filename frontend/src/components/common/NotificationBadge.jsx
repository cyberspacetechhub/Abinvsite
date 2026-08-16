import React, { useState, useEffect } from 'react';
import { Badge } from '@mui/material';
import axios from 'axios';
import baseURL from '../../shared/baseURL';
import useAuth from '../../hooks/useAuth';

const NotificationBadge = ({ children, endpoint, className = '' }) => {
  const { auth } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.get(`${baseURL}${endpoint}`, {
          headers: { 'Authorization': `Bearer ${auth.token}` }
        });
        setCount(response.data.count || 0);
      } catch (error) {
        setCount(0);
      }
    };

    if (auth.token) {
      fetchCount();
      const interval = setInterval(fetchCount, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [auth.token, endpoint]);

  return (
    <Badge 
      badgeContent={count} 
      color="error" 
      className={className}
      sx={{
        '& .MuiBadge-badge': {
          fontSize: '0.75rem',
          minWidth: '18px',
          height: '18px'
        }
      }}
    >
      {children}
    </Badge>
  );
};

export default NotificationBadge;