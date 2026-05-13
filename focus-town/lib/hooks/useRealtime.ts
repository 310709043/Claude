'use client';
import { useEffect, useRef } from 'react';
import { createClient } from '../supabase/client';
import { useSocialStore, useUserStore, useFocusStore } from '../store';
import { OnlineUser, Profile } from '../types';

export function useOnlineUsers() {
  const supabase = createClient();
  const { setOnlineUsers } = useSocialStore();
  const { profile } = useUserStore();
  const { isRunning, focusMinutesSession, timeLeft, tomatoes } = useFocusStore();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!profile) return;

    const channel = supabase.channel('online-users', {
      config: { presence: { key: profile.id } },
    });
    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<OnlineUser>();
        const users: OnlineUser[] = Object.values(state).flat();
        setOnlineUsers(users.filter(u => u.user_id !== profile.id));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: profile.id,
            username: profile.username,
            display_name: profile.display_name,
            car_color: profile.car_color,
            car_skin: profile.car_skin,
            role: profile.role,
            is_focusing: isRunning,
            focus_minutes_today: profile.focus_minutes_today + focusMinutesSession,
            tomato_count: profile.tomato_count + tomatoes,
            remaining_seconds: timeLeft,
          } as OnlineUser);
        }
      });

    return () => { channel.unsubscribe(); };
  }, [profile?.id]);

  // Re-track when focus state changes
  useEffect(() => {
    if (!channelRef.current || !profile) return;
    channelRef.current.track({
      user_id: profile.id,
      username: profile.username,
      display_name: profile.display_name,
      car_color: profile.car_color,
      car_skin: profile.car_skin,
      role: profile.role,
      is_focusing: isRunning,
      focus_minutes_today: profile.focus_minutes_today + focusMinutesSession,
      tomato_count: profile.tomato_count + tomatoes,
      remaining_seconds: timeLeft,
    } as OnlineUser);
  }, [isRunning, tomatoes]);
}

export function useFocusRequests() {
  const supabase = createClient();
  const { setIncomingRequest } = useSocialStore();
  const { profile } = useUserStore();

  useEffect(() => {
    if (!profile) return;

    const channel = supabase
      .channel(`focus-requests:${profile.id}`)
      .on('broadcast', { event: 'focus_request' }, ({ payload }) => {
        setIncomingRequest({ id: payload.request_id, fromUser: payload.from_user });
      })
      .on('broadcast', { event: 'request_accepted' }, ({ payload }) => {
        useFocusStore.getState().setPartnerId(payload.partner_id);
        useSocialStore.getState().setShowFocusRoom(true);
        setIncomingRequest(null);
      })
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, [profile?.id]);
}

export function useChatMessages(sessionId: string | null) {
  const supabase = createClient();

  const sendMessage = async (content: string) => {
    if (!sessionId) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('messages').insert({ session_id: sessionId, user_id: user.id, content });
  };

  return { sendMessage };
}

export async function sendFocusRequest(toUserId: string, fromUser: Profile) {
  const supabase = createClient();
  const channel = supabase.channel(`focus-requests:${toUserId}`);
  await channel.subscribe();
  await channel.send({
    type: 'broadcast',
    event: 'focus_request',
    payload: { request_id: Date.now().toString(), from_user: fromUser },
  });
  await channel.unsubscribe();
}

export async function acceptFocusRequest(requestId: string, toUserId: string, partnerId: string) {
  const supabase = createClient();
  const channel = supabase.channel(`focus-requests:${toUserId}`);
  await channel.subscribe();
  await channel.send({
    type: 'broadcast',
    event: 'request_accepted',
    payload: { request_id: requestId, partner_id: partnerId },
  });
  await channel.unsubscribe();
}
