/**
 * KOI Events — Broadcast and Listen
 * 
 * Handles NEW/UPDATE/FORGET events for the knowledge graph.
 */

import { RID } from './rid.js';

export interface KoiEvent {
  rid: RID;
  event_type: 'NEW' | 'UPDATE' | 'FORGET';
  manifest?: {
    rid: RID;
    timestamp: string;
    sha256_hash: string;
    metadata?: Record<string, any>;
  };
  contents?: any;
}

export type EventHandler = (event: KoiEvent) => void | Promise<void>;

export class EventManager {
  private handlers: Map<string, EventHandler[]> = new Map();
  private pendingEvents: KoiEvent[] = [];

  /**
   * Subscribe to events of a specific type
   */
  on(type: 'NEW' | 'UPDATE' | 'FORGET', handler: EventHandler): void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type)!.push(handler);
  }

  /**
   * Unsubscribe from events
   */
  off(type: 'NEW' | 'UPDATE' | 'FORGET', handler: EventHandler): void {
    const handlers = this.handlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Emit an event locally
   */
  async emit(event: KoiEvent): Promise<void> {
    // Add to pending queue
    this.pendingEvents.push(event);
    
    // Call handlers
    const handlers = this.handlers.get(event.event_type) || [];
    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error(`Event handler failed: ${error}`);
      }
    }
  }

  /**
   * Create a NEW event
   */
  static createNewEvent(
    rid: RID,
    contents: any,
    metadata?: Record<string, any>
  ): KoiEvent {
    return {
      rid,
      event_type: 'NEW',
      manifest: {
        rid,
        timestamp: new Date().toISOString(),
        sha256_hash: this.hashContents(contents),
        metadata
      },
      contents
    };
  }

  /**
   * Create an UPDATE event
   */
  static createUpdateEvent(
    rid: RID,
    contents: any,
    metadata?: Record<string, any>
  ): KoiEvent {
    return {
      rid,
      event_type: 'UPDATE',
      manifest: {
        rid,
        timestamp: new Date().toISOString(),
        sha256_hash: this.hashContents(contents),
        metadata
      },
      contents
    };
  }

  /**
   * Create a FORGET event
   */
  static createForgetEvent(rid: RID): KoiEvent {
    return {
      rid,
      event_type: 'FORGET',
      manifest: {
        rid,
        timestamp: new Date().toISOString(),
        sha256_hash: ''
      }
    };
  }

  /**
   * Get pending events (for retry, persistence, etc.)
   */
  getPendingEvents(): KoiEvent[] {
    return [...this.pendingEvents];
  }

  /**
   * Clear pending events
   */
  clearPendingEvents(): void {
    this.pendingEvents = [];
  }

  private static hashContents(contents: any): string {
    // In production, use proper SHA256
    // This is a placeholder
    const str = JSON.stringify(contents);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }
}
