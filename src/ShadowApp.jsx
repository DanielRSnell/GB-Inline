import React, { useEffect } from 'react';
import { useStore, useWordPressStore } from './storage/store.js';
import { Panel } from './components/Panel.jsx';

export function ShadowApp(props = {}) {
  // Extract props passed from PHP/server-side
  const {
    userRole = 'guest',
    siteUrl = window.location.origin,
    userId = 0,
    settings = {},
    apiNonce = '',
    pluginVersion = '1.0.0',
    isAdmin = false,
    theme = 'dark',
    tailwindCSS = ''
  } = props;

  const { openPanel, updateSettings } = useStore();
  const { setServerData } = useWordPressStore();

  // Initialize server data from props (only run once)
  useEffect(() => {
    setServerData({
      userRole,
      siteUrl,
      userId,
      settings,
      apiNonce,
      pluginVersion,
      isAdmin,
      theme,
      tailwindCSS
    });

    // Update store settings with any server settings
    if (settings && Object.keys(settings).length > 0) {
      updateSettings(settings);
    }
  }, []); // Empty dependency array to run only once

  // Note: Panel auto-open behavior is now handled by Zustand store persistence
  // The panel will maintain its last open/closed state across page reloads

  // Decode the base64 CSS content
  const decodedCSS = tailwindCSS ? atob(tailwindCSS) : '';


  return (
    <>
      {/* Inject Tailwind CSS directly as a style tag */}
      {decodedCSS && (
        <style dangerouslySetInnerHTML={{ __html: decodedCSS }} />
      )}
      
      {/* Main panel component */}
      <Panel />
    </>
  );
}