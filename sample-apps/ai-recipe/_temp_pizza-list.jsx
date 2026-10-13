
import React from 'react';
import { createRoot } from 'react-dom/client';
import WidgetPage from 'C:/Users/bikka/OneDrive/Desktop/The Glitch Gliders/ai-recipe-assistant/src/widgets/app/pizza-list/page.tsx';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  const data = window.openai?.toolOutput || {};
  
  let root = document.getElementById('widget-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'widget-root';
    document.body.appendChild(root);
  }
  
  const reactRoot = createRoot(root);
  reactRoot.render(React.createElement(WidgetPage, { data }));
}
