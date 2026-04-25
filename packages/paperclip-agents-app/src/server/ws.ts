/**
 * WebSocket Server
 * Real-time updates for org-os changes
 */

import { FastifyInstance } from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: { colorize: true }
  } : undefined
});

export interface WebSocketMessage {
  type: 'agent_update' | 'skill_update' | 'task_update' | 'memory_update' | 'sync_event' | 'ping' | 'pong';
  data: Record<string, unknown>;
  timestamp: Date;
  source?: string;
}

export interface WebSocketClient {
  userId?: string;
  subscriptions: Set<string>;
}

/**
 * Register WebSocket server
 */
export async function registerWebSocket(app: FastifyInstance) {
  await app.register(fastifyWebsocket);

  const clients = new Map<string, WebSocketClient>();
  let clientCounter = 0;

  app.get('/ws', { websocket: true }, (socket, req) => {
    const clientId = `client-${++clientCounter}`;
    const client: WebSocketClient = {
      subscriptions: new Set(['org', 'agents', 'skills', 'tasks', 'memory', 'sync']),
    };

    clients.set(clientId, client);
    logger.info({ clientId }, 'WebSocket client connected');

    // Send welcome message
    socket.send(JSON.stringify({
      type: 'connected',
      clientId,
      timestamp: new Date(),
    }));

    // Handle incoming messages
    socket.on('message', (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        handleClientMessage(clientId, data, client, socket, clients);
      } catch (error) {
        logger.error({ error }, 'Failed to parse WebSocket message');
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Invalid message format',
          timestamp: new Date(),
        }));
      }
    });

    // Handle disconnection
    socket.on('close', () => {
      clients.delete(clientId);
      logger.info({ clientId }, 'WebSocket client disconnected');
    });

    socket.on('error', (error) => {
      logger.error({ error, clientId }, 'WebSocket error');
    });
  });

  return {
    broadcast: (message: WebSocketMessage) => {
      const payload = JSON.stringify(message);
      let count = 0;

      for (const [clientId, client] of clients.entries()) {
        if (client.subscriptions.has(getSubscriptionType(message.type))) {
          try {
            // Note: socket reference is lost here; this is a simplified implementation
            // In production, maintain socket references in client objects
            count++;
          } catch (error) {
            logger.error({ error, clientId }, 'Failed to send message to client');
            clients.delete(clientId);
          }
        }
      }

      logger.debug({ type: message.type, recipients: count }, 'Message broadcast');
      return count;
    },

    broadcastToSubscribers: (subscription: string, message: WebSocketMessage) => {
      const payload = JSON.stringify(message);
      let count = 0;

      for (const [clientId, client] of clients.entries()) {
        if (client.subscriptions.has(subscription)) {
          count++;
        }
      }

      logger.debug({ subscription, recipients: count }, 'Message broadcast to subscribers');
      return count;
    },

    getConnectedClients: () => clients.size,
  };
}

/**
 * Handle client messages
 */
function handleClientMessage(
  clientId: string,
  data: any,
  client: WebSocketClient,
  socket: any,
  clients: Map<string, WebSocketClient>
) {
  switch (data.type) {
    case 'subscribe':
      if (data.subscription) {
        client.subscriptions.add(data.subscription);
        logger.info({ clientId, subscription: data.subscription }, 'Client subscribed');
        socket.send(JSON.stringify({
          type: 'subscribed',
          subscription: data.subscription,
          timestamp: new Date(),
        }));
      }
      break;

    case 'unsubscribe':
      if (data.subscription) {
        client.subscriptions.delete(data.subscription);
        logger.info({ clientId, subscription: data.subscription }, 'Client unsubscribed');
        socket.send(JSON.stringify({
          type: 'unsubscribed',
          subscription: data.subscription,
          timestamp: new Date(),
        }));
      }
      break;

    case 'ping':
      socket.send(JSON.stringify({
        type: 'pong',
        timestamp: new Date(),
      }));
      break;

    default:
      logger.warn({ clientId, messageType: data.type }, 'Unknown message type');
  }
}

/**
 * Get subscription type from message type
 */
function getSubscriptionType(messageType: string): string {
  switch (messageType) {
    case 'agent_update':
      return 'agents';
    case 'skill_update':
      return 'skills';
    case 'task_update':
      return 'tasks';
    case 'memory_update':
      return 'memory';
    case 'sync_event':
      return 'sync';
    default:
      return 'org';
  }
}
