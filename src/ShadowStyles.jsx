import { useEffect } from 'react';

const SHADOW_STYLES = `
/* ShadCN + Gutenberg inspired design system for Shadow DOM */
:host {
  /* ShadCN Color Palette with Gutenberg influences */
  --background: 255 255 255;
  --foreground: 2 8 23;
  --card: 255 255 255;
  --card-foreground: 2 8 23;
  --popover: 255 255 255;
  --popover-foreground: 2 8 23;
  --primary: 15 23 42;
  --primary-foreground: 248 250 252;
  --secondary: 241 245 249;
  --secondary-foreground: 15 23 42;
  --muted: 241 245 249;
  --muted-foreground: 100 116 139;
  --accent: 241 245 249;
  --accent-foreground: 15 23 42;
  --destructive: 239 68 68;
  --destructive-foreground: 248 250 252;
  --border: 226 232 240;
  --input: 226 232 240;
  --ring: 15 23 42;
  
  /* Gutenberg colors */
  --wp-admin-theme-color: 0 115 170;
  --wp-admin-theme-color-darker-10: 0 103 153;
  --wp-admin-theme-color-darker-20: 0 86 132;
  
  /* Typography */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  
  /* Radius */
  --radius-sm: 4px;
  --radius: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  
  /* Transitions */
  --transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
  box-sizing: border-box;
}

/* Global app wrapper */
.shadow-plugin-app {
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  color: var(--raycast-text-primary);
}

/* Panel Styles */
.plugin-boilerplate {
  position: fixed !important;
  top: 0 !important;
  bottom: 0 !important;
  z-index: 9999999 !important;
  display: flex !important;
  flex-direction: column !important;
  min-height: 100vh !important;
  background: var(--raycast-bg) !important;
  backdrop-filter: blur(40px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(40px) saturate(180%) !important;
  border: 1px solid var(--raycast-border) !important;
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.4),
    0 16px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
  transition: var(--transition) !important;
  overflow: hidden !important;
  pointer-events: auto !important;
  margin: 0 !important;
  padding: 0 !important;
  max-height: none !important;
  max-width: none !important;
  transform: none !important;
  contain: layout style paint !important;
  isolation: isolate !important;
}

.plugin-boilerplate.right {
  right: 0;
  border-radius: var(--radius-xl) 0 0 var(--radius-xl);
  border-right: none;
}

.plugin-boilerplate.left {
  left: 0;
  border-radius: 0 var(--radius-xl) var(--radius-xl) 0;
  border-left: none;
}

.plugin-boilerplate.fullscreen {
  left: 0;
  right: 0;
  width: 100vw;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid var(--raycast-border);
}

.shadow-resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: ew-resize;
  background: transparent;
  transition: background-color 0.2s ease;
  z-index: 10;
}

.shadow-resize-handle:hover {
  background: var(--raycast-accent);
}

.shadow-resize-left {
  left: 0;
}

.shadow-resize-right {
  right: 0;
}

/* Header */
.shadow-plugin-header {
  background: var(--raycast-surface);
  border-bottom: 1px solid var(--raycast-border);
  padding: var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-shrink: 0;
}

.shadow-plugin-tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius);
  padding: 2px;
  gap: 2px;
}

.shadow-plugin-tab {
  background: transparent;
  border: none;
  border-radius: calc(var(--radius) - 2px);
  color: var(--raycast-text-secondary);
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  padding: var(--space-2) var(--space-4);
  transition: var(--transition-fast);
  outline: none;
}

.shadow-plugin-tab:hover {
  color: var(--raycast-text-primary);
  background: rgba(255, 255, 255, 0.1);
}

.shadow-plugin-tab.active {
  background: var(--raycast-accent);
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 99, 99, 0.3);
}

.shadow-plugin-tab.active:hover {
  background: var(--raycast-accent-hover);
  color: white;
}

.shadow-panel-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.shadow-panel-content {
  flex: 1 !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  height: auto !important;
  max-height: none !important;
  position: relative !important;
}

/* Button Styles */
.shadow-button {
  background: var(--raycast-surface);
  border: 1px solid var(--raycast-border);
  border-radius: var(--radius);
  color: var(--raycast-text-primary);
  cursor: pointer;
  font-family: var(--font-sans);
  font-weight: 500;
  transition: var(--transition);
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.shadow-button-sm {
  height: 28px;
  padding: 0 var(--space-3);
  font-size: 13px;
}

.shadow-button-md {
  height: 32px;
  padding: 0 var(--space-4);
  font-size: 14px;
}

.shadow-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.shadow-button:hover {
  background: var(--raycast-surface-hover);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.shadow-button:hover::before {
  opacity: 1;
}

.shadow-button:active {
  background: var(--raycast-surface-active);
  transform: translateY(0);
}

.shadow-button:focus-visible {
  outline: 2px solid var(--raycast-accent);
  outline-offset: 2px;
}

.shadow-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.shadow-button-default {
  background: var(--raycast-accent);
  border-color: var(--raycast-accent);
  color: white;
}

.shadow-button-default:hover:not(:disabled) {
  background: var(--raycast-accent-hover);
  border-color: var(--raycast-accent-hover);
}

.shadow-button-ghost {
  background: transparent;
  border: none;
  color: var(--raycast-text-secondary);
}

.shadow-button-ghost:hover:not(:disabled) {
  background: var(--raycast-surface);
  color: var(--raycast-text-primary);
}

.shadow-button svg {
  width: 16px;
  height: 16px;
  opacity: 0.8;
}

/* Command Palette Styles */
.shadow-command-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: transparent;
}

.shadow-command-input-wrapper {
  position: relative;
  padding: var(--space-4);
  background: var(--raycast-surface);
  border-bottom: 1px solid var(--raycast-border);
}

.shadow-command-search-icon {
  position: absolute;
  left: calc(var(--space-4) + var(--space-4));
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  opacity: 0.5;
  pointer-events: none;
  color: var(--raycast-text-tertiary);
}

.shadow-command-input {
  background: var(--raycast-bg);
  border: 1px solid var(--raycast-border);
  border-radius: var(--radius);
  color: var(--raycast-text-primary);
  font-family: var(--font-sans);
  font-size: 14px;
  padding: var(--space-3) var(--space-4) var(--space-3) var(--space-10);
  transition: var(--transition);
  outline: none;
  width: 100%;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.shadow-command-input::placeholder {
  color: var(--raycast-text-tertiary);
}

.shadow-command-input:focus {
  background: var(--raycast-surface-hover);
  border-color: var(--raycast-accent);
  box-shadow: 0 0 0 2px rgba(255, 99, 99, 0.2);
}

.shadow-command-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-2);
  background: transparent;
}

.shadow-command-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
  color: var(--raycast-text-tertiary);
  font-size: 14px;
  text-align: center;
}

.shadow-command-item {
  background: transparent;
  border: none;
  border-radius: var(--radius);
  color: var(--raycast-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  transition: var(--transition-fast);
  width: 100%;
  text-align: left;
  margin-bottom: 2px;
}

.shadow-command-item:hover {
  background: var(--raycast-surface);
}

.shadow-command-item-selected {
  background: var(--raycast-accent);
  color: white;
}

/* Toast Styles */
.shadow-toast-container {
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  z-index: 10000;
  pointer-events: none;
}

.shadow-toast {
  background: var(--raycast-surface);
  border: 1px solid var(--raycast-border);
  border-radius: var(--radius);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-2);
  max-width: 400px;
  pointer-events: auto;
  cursor: pointer;
  transition: var(--transition);
}

.shadow-toast:hover {
  background: var(--raycast-surface-hover);
}

.shadow-toast-success {
  border-left: 3px solid var(--raycast-green);
}

.shadow-toast-error {
  border-left: 3px solid #ff453a;
}

.shadow-toast-info {
  border-left: 3px solid var(--raycast-accent);
}

.shadow-toast-message {
  flex: 1;
  font-size: 14px;
  color: var(--raycast-text-primary);
}

/* Scrollbar Styles */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Focus styles */
:focus-visible {
  outline: 2px solid var(--raycast-accent);
  outline-offset: 2px;
}

/* Form Controls */
.shadow-form-group {
  margin-bottom: var(--space-4);
}

.shadow-form-group label {
  display: block;
  margin-bottom: var(--space-2);
  font-size: 14px;
  font-weight: 500;
  color: var(--raycast-text-primary);
}

.shadow-form-input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  background: var(--raycast-bg);
  border: 1px solid var(--raycast-border);
  border-radius: var(--radius);
  color: var(--raycast-text-primary);
  font-size: 14px;
  transition: var(--transition);
}

.shadow-form-input:focus {
  outline: none;
  border-color: var(--raycast-accent);
  box-shadow: 0 0 0 3px rgba(255, 99, 99, 0.1);
}

.shadow-form-input::placeholder {
  color: var(--raycast-text-tertiary);
}
`;

export function ShadowStyles() {
  useEffect(() => {
    // Find the shadow root
    const shadowHost = document.querySelector('shadow-plugin-panel');
    const shadowRoot = shadowHost?.shadowRoot;
    
    if (shadowRoot) {
      // Check if styles are already injected
      if (!shadowRoot.querySelector('#shadow-plugin-styles')) {
        // Create style element
        const styleElement = document.createElement('style');
        styleElement.id = 'shadow-plugin-styles';
        styleElement.textContent = SHADOW_STYLES;
        
        // Insert at the beginning of shadow root
        shadowRoot.insertBefore(styleElement, shadowRoot.firstChild);
      }
    }
  }, []);

  return null; // This component doesn't render anything
}