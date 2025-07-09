import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../storage/store.js';
import { DEMO_COMMANDS } from '../utils/constants.js';
import { cn } from '../utils/helpers.js';

export function CommandPalette({ onCommandSelect }) {
  const { 
    searchQuery, 
    selectedCommandIndex, 
    setSearchQuery, 
    setSelectedCommandIndex,
    getFilteredCommands 
  } = useStore();

  const filteredCommands = getFilteredCommands(DEMO_COMMANDS);

  useEffect(() => {
    // Reset selection when filtered commands change
    if (selectedCommandIndex >= filteredCommands.length) {
      setSelectedCommandIndex(0);
    }
  }, [filteredCommands.length, selectedCommandIndex, setSelectedCommandIndex]);

  const handleCommandClick = (command) => {
    if (onCommandSelect) {
      onCommandSelect(command);
    }
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedCommandIndex(Math.min(filteredCommands.length - 1, selectedCommandIndex + 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedCommandIndex(Math.max(0, selectedCommandIndex - 1));
        break;
      case 'Enter':
        event.preventDefault();
        if (filteredCommands[selectedCommandIndex]) {
          handleCommandClick(filteredCommands[selectedCommandIndex]);
        }
        break;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Input */}
      <div className="relative p-4 border-b border-border">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className="h-4 w-4 text-muted-foreground" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          <input
            type="text"
            className={cn(
              "w-full pl-10 pr-4 py-3 bg-background border border-input rounded-md",
              "text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
              "transition-colors duration-200"
            )}
            placeholder="Search commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            aria-label="Search commands"
            role="searchbox"
          />
        </div>
      </div>

      {/* Commands List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredCommands.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <svg 
              className="h-12 w-12 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <p className="text-sm">No commands found</p>
            <p className="text-xs mt-1">Try adjusting your search</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredCommands.map((command, index) => (
              <CommandItem
                key={command.id}
                command={command}
                isSelected={index === selectedCommandIndex}
                onClick={() => handleCommandClick(command)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <kbd className="px-2 py-1 bg-background border border-border rounded text-xs shadow-sm">↑↓</kbd>
              <span className="ml-2">Navigate</span>
            </span>
            <span className="flex items-center">
              <kbd className="px-2 py-1 bg-background border border-border rounded text-xs shadow-sm">Enter</kbd>
              <span className="ml-2">Select</span>
            </span>
          </div>
          <div className="flex items-center">
            <kbd className="px-2 py-1 bg-background border border-border rounded text-xs shadow-sm">Esc</kbd>
            <span className="ml-2">Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommandItem({ command, isSelected, onClick, index }) {
  return (
    <motion.button
      className={cn(
        "w-full p-3 rounded-md text-left transition-all duration-150",
        "flex items-start space-x-3 group",
        isSelected 
          ? "bg-accent text-accent-foreground" 
          : "text-foreground hover:bg-accent/50"
      )}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Icon */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-lg",
        isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
      )}>
        {command.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className={cn(
          "font-medium text-sm mb-1 truncate",
          isSelected ? "text-accent-foreground" : "text-foreground"
        )}>
          {command.title}
        </div>
        <div className={cn(
          "text-xs leading-relaxed",
          isSelected ? "text-muted-foreground" : "text-muted-foreground"
        )}>
          {command.description}
        </div>
        
        {/* Category Badge */}
        {command.category && (
          <div className="mt-2">
            <span className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
              isSelected 
                ? "bg-primary/20 text-primary" 
                : "bg-muted text-muted-foreground"
            )}>
              {command.category}
            </span>
          </div>
        )}
      </div>

      {/* Action Indicator */}
      {command.action && (
        <div className="flex-shrink-0 flex items-center">
          <svg 
            className={cn(
              "h-4 w-4",
              isSelected ? "text-white" : "text-gray-500"
            )} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </div>
      )}
    </motion.button>
  );
}