import React from 'react';
import InventoryDashboard from '../pages/InventoryDashboard';
import InventoryForm from '../pages/InventoryForm';
import Reports from '../pages/Reports';
import Alerts from '../pages/Alerts';

const AppRoutes = [
  { path: '/dashboard', element: <InventoryDashboard /> },
  { path: '/add-product', element: <InventoryForm /> },
  { path: '/reports', element: <Reports /> },
  { path: '/alerts', element: <Alerts /> },
];

export default AppRoutes;
