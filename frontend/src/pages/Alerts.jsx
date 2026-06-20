import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getAlerts, getProducts } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlertData = async () => {
    try {
      setLoading(true);
      const [alertList, productList] = await Promise.all([getAlerts(), getProducts()]);
      setAlerts(alertList);
      setProducts(productList);
    } catch (err) {
      console.error('Failed to load alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertData();
  }, []);

  const getAlertSeverity = (type) => {
    if (type === 'Out of Stock') return { color: '#d32f2f', icon: <ErrorIcon sx={{ color: '#d32f2f' }} />, bg: 'rgba(211, 47, 47, 0.08)' };
    if (type === 'Low Stock') return { color: '#ffb300', icon: <WarningIcon sx={{ color: '#ffb300' }} />, bg: 'rgba(255, 179, 0, 0.08)' };
    return { color: '#2e7d32', icon: <CheckCircleIcon sx={{ color: '#2e7d32' }} />, bg: 'rgba(46, 125, 50, 0.08)' };
  };

  const outOfStockAlerts = alerts.filter(a => a.alert_type === 'Out of Stock');
  const lowStockAlerts = alerts.filter(a => a.alert_type === 'Low Stock');
  const healthyCount = products.filter(p => p.stock_level > p.reorder_level).length;

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Alerts & Notifications
      </Typography>

      {/* Grid summarizing Alert severity */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'rgba(211, 47, 47, 0.12)', border: '1px solid #d32f2f' }}>
            <CardContent display="flex" flexDirection="column" alignItems="center">
              <Typography variant="subtitle2" color="error.light" fontWeight="bold">Out of Stock Alerts</Typography>
              <Typography variant="h3" fontWeight="bold" color="error.main">{outOfStockAlerts.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'rgba(255, 179, 0, 0.12)', border: '1px solid #ffb300' }}>
            <CardContent>
              <Typography variant="subtitle2" color="warning.light" fontWeight="bold">Low Stock Alerts</Typography>
              <Typography variant="h3" fontWeight="bold" color="warning.main">{lowStockAlerts.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'rgba(46, 125, 50, 0.12)', border: '1px solid #2e7d32' }}>
            <CardContent>
              <Typography variant="subtitle2" color="success.light" fontWeight="bold">Healthy SKUs</Typography>
              <Typography variant="h3" fontWeight="bold" color="success.main">{healthyCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detail logs of system alerts */}
      <Paper sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          System Alert Log
        </Typography>

        {alerts.length === 0 ? (
          <EmptyState message="All systems nominal. No alerts generated." />
        ) : (
          <List>
            {alerts.map((alert) => {
              const severity = getAlertSeverity(alert.alert_type);
              return (
                <ListItem
                  key={alert.id}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    bgcolor: severity.bg,
                    border: `1px solid ${severity.color}44`,
                  }}
                >
                  <ListItemIcon>{severity.icon}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" gap={1.5} alignItems="center">
                        <Typography variant="subtitle1" fontWeight="bold">
                          {alert.product_name}
                        </Typography>
                        <Chip
                          label={alert.sku}
                          size="small"
                          sx={{ height: 20, fontSize: '0.75rem' }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box mt={0.5}>
                        <Typography variant="body2" color="text.primary">
                          {alert.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                          Generated at: {new Date(alert.created_at).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                  <Chip
                    label={alert.alert_type}
                    size="small"
                    sx={{
                      bgcolor: severity.color,
                      color: '#fff',
                      fontWeight: 'bold',
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </Paper>
    </Box>
  );
}

export default Alerts;
