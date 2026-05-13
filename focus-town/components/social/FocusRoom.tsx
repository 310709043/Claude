'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Users } from 'lucide-react';
import { useSocialStore, useUserStore, useFocusStore } from '@/lib/store';
import { useChatMessages } from '@/lib/hooks/useRealtime';
import { createClient } from '@/lib/supabase/client';
import { Message } from '@/lib/types';

function PairedCarAnimation({ color1, color2 }: { color1: string; color2: string }) {
  return (
    <div className="flex items-center gap-4 justify-center py-4">
      {/* Car 1 */}
      <motion.div
        animate={{ x: [0, 4, 0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ position: 'relative', width: 28, height: 14 }}
      >
        <div style={{ position:'absolute', top:4, left:1, width:26, height:7, background:color1 }} />
        <div style={{ position:'absolute', top:1, left:6, width:14, height:5, background:color1, opacity:0.8 }} />
        <div style={{ position:'absolute', top:4, left:0, width:2, height:2, background:'#ffeaa7', boxShadow:'0 0 4px #ffeaa7' }} />
        <div style={{ position:'absolute', top:10, left:4, width:4, height:4, background:'#2d3436' }} />
        <div style={{ position:'absolute', top:10, left:20, width:4, height:4, background:'#2d3436' }} />
      </motion.div>

      {/* Hearts */}
      <div className="flex flex-col items-center gap-1">
        {['❤️','💜','💙'].map((h, i) => (
          <motion.span key={i} animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, delay: i * 0.5, repeat: Infinity }} style={{ fontSize: 8 }}>{h}</motion.span>
        ))}
      </div>

      {/* Car 2 */}
      <motion.div
        animate={{ x: [0, -4, 0, 4, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ position: 'relative', width: 28, height: 14, transform: 'scaleX(-1)' }}
      >
        <div style={{ position:'absolute', top:4, left:1, width:26, height:7, background:color2 }} />
        <div style={{ position:'absolute', top:1, left:6, width:14, height:5, background:color2, opacity:0.8 }} />
        <div style={{ position:'absolute', top:4, left:0, width:2, height:2, background:'#ffeaa7', boxShadow:'0 0 4px #ffeaa7' }} />
        <div style={{ position:'absolute', top:10, left:4, width:4, height:4, background:'#2d3436' }} />
        <div style={{ position:'absolute', top:10, left:20, width:4, height:4, background:'#2d3436' }} />
      </motion.div>
    </div>
  );
}

export function FocusRoom() {
  const { showFocusRoom, setShowFocusRoom, onlineUsers } = useSocialStore();
  const { profile } = useUserStore();
  const { partnerId, sessionId, timeLeft, isRunning, mode } = useFocusStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { sendMessage } = useChatMessages(sessionId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const partner = onlineUsers.find(u => u.user_id === partnerId);

  // Fetch and subscribe to messages
  useEffect(() => {
    if (!sessionId) return;

    const fetch = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*, profile:profiles(username,display_name,avatar_url,car_color)')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      if (data) setMessages(data as Message[]);
    };
    fetch();

    const channel = supabase
      .channel(`messages:${sessionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `session_id=eq.${sessionId}` },
        async (payload) => {
          const { data } = await supabase
            .from('messages')
            .select('*, profile:profiles(username,display_name,avatar_url,car_color)')
            .eq('id', payload.new.id)
            .single();
          if (data) setMessages(m => [...m, data as Message]);
        }
      )
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    await sendMessage(text);
    setInput('');
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2,'0');
  const seconds = (timeLeft % 60).toString().padStart(2,'0');
  const modeColor = mode === 'focus' ? '#6c5ce7' : mode === 'short_break' ? '#00b894' : '#0984e3';

  if (!showFocusRoom) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.75)', zIndex: 150 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="pixel-card w-full max-w-lg mx-4 flex flex-col"
          style={{ height: '80vh', maxHeight: 600 }}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(108,92,231,0.3)' }}>
            <div className="flex items-center gap-2">
              <Users size={14} color="#74b9ff" />
              <span style={{ fontFamily:'"Press Start 2P"', fontSize:8, color:'#74b9ff' }}>CO-FOCUS ROOM</span>
            </div>
            <button onClick={() => setShowFocusRoom(false)}>
              <X size={14} color="#636e72" />
            </button>
          </div>

          {/* Paired cars animation */}
          <PairedCarAnimation
            color1={profile?.car_color || '#6c5ce7'}
            color2={partner?.car_color || '#fd79a8'}
          />

          {/* Shared timer display */}
          <div className="text-center px-4 pb-3">
            <div style={{ fontFamily:'"Press Start 2P"', fontSize:24, color:modeColor, letterSpacing:4 }}>
              {minutes}:{seconds}
            </div>
            <div style={{ fontFamily:'"Press Start 2P"', fontSize:6, color:'#a29bfe', marginTop:4 }}>
              {partner ? `${partner.display_name || partner.username} is here 👥` : 'Waiting for partner...'}
            </div>
            {isRunning && (
              <div className="mt-2 w-full h-1 bg-gray-800">
                <motion.div
                  className="h-full"
                  style={{ background: modeColor }}
                  animate={{ width: '100%' }}
                  initial={{ width: '0%' }}
                  transition={{ duration: timeLeft, ease: 'linear' }}
                />
              </div>
            )}
          </div>

          {/* Chat */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2" style={{ background: 'rgba(15,12,41,0.4)' }}>
            {messages.map(m => {
              const isMe = m.user_id === profile?.id;
              return (
                <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-2 py-1 ${isMe ? 'bg-purple-900/60 border-purple-600' : 'bg-gray-800/60 border-gray-600'}`}
                    style={{ border: `1px solid` }}
                  >
                    {!isMe && (
                      <div style={{ fontFamily:'"Press Start 2P"', fontSize:5, color:'#74b9ff', marginBottom:2 }}>
                        {m.profile?.display_name || m.profile?.username || 'Partner'}
                      </div>
                    )}
                    <div style={{ fontFamily:'"Share Tech Mono"', fontSize:11, color:'#dfe6e9' }}>{m.content}</div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Message input */}
          <div className="flex gap-2 p-3 border-t" style={{ borderColor:'rgba(108,92,231,0.3)' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Say something..."
              className="flex-1 px-2 py-1 outline-none"
              style={{ fontFamily:'"Share Tech Mono"', fontSize:10, background:'rgba(15,12,41,0.6)', border:'1px solid rgba(108,92,231,0.3)', color:'#dfe6e9' }}
            />
            <button onClick={handleSend} className="pixel-btn px-2">
              <Send size={10} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
