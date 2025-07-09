/**
 * Keyboard shortcuts handler
 */

import { KEYBOARD_SHORTCUTS } from './constants.js';

export class KeyboardShortcutManager {
  constructor() {
    this.shortcuts = new Map();
    this.isEnabled = true;
    this.boundHandler = this.handleKeyDown.bind(this);
  }

  /**
   * Initialize keyboard shortcuts
   */
  init() {
    document.addEventListener('keydown', this.boundHandler);
  }

  /**
   * Cleanup keyboard shortcuts
   */
  destroy() {
    document.removeEventListener('keydown', this.boundHandler);
    this.shortcuts.clear();
  }

  /**
   * Enable/disable keyboard shortcuts
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  /**
   * Register a keyboard shortcut
   */
  register(key, callback, options = {}) {
    const normalizedKey = this.normalizeKey(key);
    this.shortcuts.set(normalizedKey, {
      callback,
      ...options
    });
  }

  /**
   * Unregister a keyboard shortcut
   */
  unregister(key) {
    const normalizedKey = this.normalizeKey(key);
    this.shortcuts.delete(normalizedKey);
  }

  /**
   * Handle keydown events
   */
  handleKeyDown(event) {
    if (!this.isEnabled) return;

    // Don't trigger shortcuts when typing in inputs
    if (this.isTypingInInput(event.target)) return;

    const key = this.getEventKey(event);
    const shortcut = this.shortcuts.get(key);

    if (shortcut) {
      // Check if shortcut should be prevented based on conditions
      if (shortcut.condition && !shortcut.condition()) return;

      event.preventDefault();
      event.stopPropagation();
      shortcut.callback(event);
    }
  }

  /**
   * Check if user is typing in an input field
   */
  isTypingInInput(target) {
    const inputTags = ['INPUT', 'TEXTAREA', 'SELECT'];
    const isContentEditable = target.contentEditable === 'true';
    return inputTags.includes(target.tagName) || isContentEditable;
  }

  /**
   * Get normalized key from keyboard event
   */
  getEventKey(event) {
    const parts = [];
    
    if (event.ctrlKey || event.metaKey) {
      parts.push(event.metaKey ? 'cmd' : 'ctrl');
    }
    if (event.shiftKey) parts.push('shift');
    if (event.altKey) parts.push('alt');
    
    const key = event.key.toLowerCase();
    parts.push(key === ' ' ? 'space' : key);
    
    return parts.join('+');
  }

  /**
   * Normalize shortcut key string
   */
  normalizeKey(key) {
    return key.toLowerCase().replace(/\s+/g, '');
  }

  /**
   * Get all registered shortcuts
   */
  getShortcuts() {
    return Array.from(this.shortcuts.entries()).map(([key, config]) => ({
      key,
      ...config
    }));
  }
}

/**
 * Create and configure the global keyboard shortcut manager
 */
export const createKeyboardManager = (store) => {
  const manager = new KeyboardShortcutManager();
  
  // Register default shortcuts
  manager.register(KEYBOARD_SHORTCUTS.TOGGLE_PANEL, () => {
    store.getState().togglePanel();
  }, {
    description: 'Toggle panel visibility'
  });

  manager.register(KEYBOARD_SHORTCUTS.CLOSE_PANEL, () => {
    if (store.getState().isPanelOpen) {
      store.getState().closePanel();
    }
  }, {
    description: 'Close panel',
    condition: () => store.getState().isPanelOpen
  });

  manager.register(KEYBOARD_SHORTCUTS.NAVIGATE_UP, (event) => {
    const state = store.getState();
    if (state.isPanelOpen) {
      const newIndex = Math.max(0, state.selectedCommandIndex - 1);
      state.setSelectedCommandIndex(newIndex);
    }
  }, {
    description: 'Navigate up in command list',
    condition: () => store.getState().isPanelOpen
  });

  manager.register(KEYBOARD_SHORTCUTS.NAVIGATE_DOWN, (event) => {
    const state = store.getState();
    if (state.isPanelOpen) {
      // This would need access to the current filtered commands length
      const newIndex = state.selectedCommandIndex + 1;
      state.setSelectedCommandIndex(newIndex);
    }
  }, {
    description: 'Navigate down in command list',
    condition: () => store.getState().isPanelOpen
  });

  return manager;
};

/**
 * Hook for using keyboard shortcuts in React components
 */
export const useKeyboardShortcuts = (shortcuts = [], enabled = true) => {
  const manager = new KeyboardShortcutManager();
  
  React.useEffect(() => {
    if (!enabled) return;
    
    manager.init();
    manager.setEnabled(enabled);
    
    // Register shortcuts
    shortcuts.forEach(({ key, callback, ...options }) => {
      manager.register(key, callback, options);
    });
    
    return () => {
      manager.destroy();
    };
  }, [shortcuts, enabled]);
  
  return manager;
};