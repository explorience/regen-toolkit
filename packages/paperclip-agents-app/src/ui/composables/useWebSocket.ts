/**
 * WebSocket Composable
 * Real-time updates for org-os changes
 */

import { ref, onMounted, onUnmounted } from 'vue';

export interface WebSocketMessage {
  type: string;
  data?: Record<string, unknown>;
  timestamp?: Date;
}

export const useWebSocket = (url = 'ws://localhost:3100/ws') => {
  const ws = ref<WebSocket | null>(null);
  const isConnected = ref(false);
  const connectionError = ref<string | null>(null);
  const lastMessage = ref<WebSocketMessage | null>(null);
  const subscriptions = ref<Set<string>>(new Set());

  const connect = () => {
    try {
      ws.value = new WebSocket(url);

      ws.value.onopen = () => {
        isConnected.value = true;
        connectionError.value = null;
        console.log('WebSocket connected');
      };

      ws.value.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          lastMessage.value = message;

          // Auto-resubscribe if disconnected
          if (message.type === 'connected' && subscriptions.value.size > 0) {
            for (const sub of subscriptions.value) {
              subscribe(sub);
            }
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.value.onerror = (event) => {
        connectionError.value = 'WebSocket error occurred';
        console.error('WebSocket error:', event);
      };

      ws.value.onclose = () => {
        isConnected.value = false;
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (!isConnected.value) {
            connect();
          }
        }, 3000);
      };
    } catch (error) {
      connectionError.value = error instanceof Error ? error.message : 'Connection failed';
      console.error('Failed to create WebSocket:', error);
    }
  };

  const disconnect = () => {
    if (ws.value) {
      ws.value.close();
      ws.value = null;
      isConnected.value = false;
    }
  };

  const subscribe = (subscription: string) => {
    subscriptions.value.add(subscription);

    if (isConnected.value && ws.value) {
      ws.value.send(JSON.stringify({
        type: 'subscribe',
        subscription,
      }));
    }
  };

  const unsubscribe = (subscription: string) => {
    subscriptions.value.delete(subscription);

    if (isConnected.value && ws.value) {
      ws.value.send(JSON.stringify({
        type: 'unsubscribe',
        subscription,
      }));
    }
  };

  const send = (message: WebSocketMessage) => {
    if (isConnected.value && ws.value) {
      ws.value.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected');
    }
  };

  const ping = () => {
    send({ type: 'ping' });
  };

  onMounted(() => {
    connect();
  });

  onUnmounted(() => {
    disconnect();
  });

  return {
    ws,
    isConnected,
    connectionError,
    lastMessage,
    subscriptions: subscriptions.value,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    send,
    ping,
  };
};
