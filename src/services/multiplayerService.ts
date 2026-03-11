import { supabase } from '../lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface Player {
  id: string;
  nickname: string;
  score: number;
  lastAnswered?: string;
  isCorrect?: boolean;
}

export type MultiplayerEvent =
  | { type: 'STATE_CHANGE', status: 'waiting' | 'active' | 'finished' }
  | { type: 'NEXT_QUESTION', index: number }
  | { type: 'PLAYER_JOINED', player: Player }
  | { type: 'PLAYER_SCORED', playerId: string, score: number, isCorrect: boolean }
  | { type: 'SYNC_TIMER', seconds: number };

export function createRoom(roomName: string, onEvent: (event: MultiplayerEvent) => void): RealtimeChannel {
  const channel = supabase.channel(`room:${roomName}`, {
    config: {
      presence: { key: 'players' },
      broadcast: { self: true }
    }
  });

  channel
    .on('broadcast', { event: 'game_event' }, ({ payload }) => {
      onEvent(payload as MultiplayerEvent);
    })
    // .on('presence', { event: 'sync' }, () => {
    // })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Joined room: ${roomName}`);
      }
    });

  return channel;
}

export function broadcastEvent(channel: RealtimeChannel, event: MultiplayerEvent) {
  channel.send({
    type: 'broadcast',
    event: 'game_event',
    payload: event
  });
}
