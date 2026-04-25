/**
 * Organization Context
 * 
 * Global state for org-os data
 */

import React, { createContext, useContext } from 'react';

export const OrgContext = createContext(null);

export function useOrg() {
  const context = useContext(OrgContext);
  if (!context) {
    // Return default state instead of throwing
    return {
      org: { name: 'ReFi Barcelona', identifier: 'refi-bcn', uri: '', path: '', agents: [], skills: [] },
      agents: new Map(),
      skills: new Map(),
      lastRefresh: 0,
      isLoading: false,
      error: undefined,
      reload: async () => {},
    };
  }
  return context;
}

export function OrgProvider({ children }) {
  // Mock state for now (API server not running)
  const state = {
    org: { 
      name: 'ReFi Barcelona', 
      identifier: 'refi-bcn', 
      uri: 'https://refibcn.cat/.well-known/org.json', 
      path: '.', 
      agents: [
        { id: 'refi-bcn-coordinator', name: 'ReFi BCN Coordinator', runtime: 'openclaw', capabilities: ['coordination', 'governance'], budget: 300, status: 'idle' },
        { id: 'refi-bcn-cursor', name: 'ReFi BCN Cursor', runtime: 'cursor', capabilities: ['development', 'documentation'], budget: 200, status: 'idle' },
        { id: 'refi-bcn-legal-advisor', name: 'Legal Advisor', runtime: 'claude-code', capabilities: ['legal-research', 'cooperative-law'], budget: 250, status: 'idle' },
        { id: 'refi-bcn-funding-scout', name: 'Funding Scout', runtime: 'openclaw', capabilities: ['funding-research', 'opportunity-tracking'], budget: 150, status: 'idle' },
        { id: 'telegram-bot', name: 'Telegram Bot', runtime: 'custom', capabilities: ['messaging', 'routing'], budget: 50, status: 'idle' },
      ],
      skills: []
    },
    agents: new Map([
      ['refi-bcn-coordinator', { id: 'refi-bcn-coordinator', name: 'ReFi BCN Coordinator', runtime: 'openclaw', capabilities: ['coordination', 'governance'], budget: 300, status: 'idle' }],
      ['refi-bcn-cursor', { id: 'refi-bcn-cursor', name: 'ReFi BCN Cursor', runtime: 'cursor', capabilities: ['development', 'documentation'], budget: 200, status: 'idle' }],
      ['refi-bcn-legal-advisor', { id: 'refi-bcn-legal-advisor', name: 'Legal Advisor', runtime: 'claude-code', capabilities: ['legal-research', 'cooperative-law'], budget: 250, status: 'idle' }],
      ['refi-bcn-funding-scout', { id: 'refi-bcn-funding-scout', name: 'Funding Scout', runtime: 'openclaw', capabilities: ['funding-research', 'opportunity-tracking'], budget: 150, status: 'idle' }],
      ['telegram-bot', { id: 'telegram-bot', name: 'Telegram Bot', runtime: 'custom', capabilities: ['messaging', 'routing'], budget: 50, status: 'idle' }],
    ]),
    skills: new Map(),
    lastRefresh: Date.now(),
    isLoading: false,
    error: undefined,
    reload: async () => {},
  };

  return <OrgContext.Provider value={state}>{children}</OrgContext.Provider>;
}
