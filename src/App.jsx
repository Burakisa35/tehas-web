import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen.jsx';
import FlowWizard from './components/FlowWizard.jsx';

export default function App() {
  // 'home' | flowId ('elektrik', 'kamera', vb.)
  const [screen, setScreen] = useState('home');

  function startFlow(flowId) {
    setScreen(flowId);
    // Sayfa başına scroll (mobilde önemli)
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function goHome() {
    setScreen('home');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  if (screen === 'home') {
    return <HomeScreen onFlowStart={startFlow} />;
  }

  return <FlowWizard flowId={screen} onBack={goHome} />;
}
