import React from 'react';
import { unstableSetRender } from 'antd';
import { createRoot } from 'react-dom/client';
import AppRoutes from './router/routes';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from './contexts/ThemeContext';
import 'antd/dist/reset.css';
import './styles/globals.css';
import './styles/theme.css';

unstableSetRender((node, container) => {
  container._reactRoot ||= createRoot(container);
  const root = container._reactRoot;
  root.render(node);

  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    root.unmount();
  };
});

const root = createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider>
    <ConfigProvider>
      <AppRoutes />
    </ConfigProvider>
  </ThemeProvider>
);
