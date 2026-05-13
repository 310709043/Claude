'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, BookOpen } from 'lucide-react';
import { useFocusStore } from '@/lib/store';

export function NotePanel() {
  const { notes, addNote, toggleNote, deleteNote } = useFocusStore();
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const text = input.trim();
    if (!text) return;
    addNote(text);
    setInput('');
  };

  return (
    <motion.div
      className="pixel-card w-64 flex flex-col"
      style={{ maxHeight: 400 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 p-3 border-b"
        style={{ borderColor: 'rgba(108,92,231,0.3)' }}
      >
        <BookOpen size={12} color="#a29bfe" />
        <span style={{ fontFamily: '"Press Start 2P"', fontSize: 7, color: '#a29bfe' }}>TASK NOTES</span>
      </div>

      {/* Notebook body - pixel art lined paper style */}
      <div
        className="flex-1 overflow-y-auto p-2"
        style={{
          background: 'rgba(25,20,50,0.6)',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(108,92,231,0.15) 19px, rgba(108,92,231,0.15) 20px)',
          minHeight: 180,
        }}
      >
        <AnimatePresence>
          {notes.map(note => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-start gap-2 py-1 group"
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleNote(note.id)}
                className="flex-shrink-0 mt-0.5"
                style={{
                  width: 10, height: 10,
                  background: note.completed ? '#6c5ce7' : 'transparent',
                  border: `1px solid ${note.completed ? '#a29bfe' : '#636e72'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {note.completed && <Check size={6} color="white" />}
              </button>

              {/* Text */}
              <span
                style={{
                  fontFamily: '"Share Tech Mono"', fontSize: 10,
                  color: note.completed ? '#636e72' : '#dfe6e9',
                  textDecoration: note.completed ? 'line-through' : 'none',
                  flex: 1, lineHeight: 1.4,
                }}
              >
                {note.text}
              </span>

              {/* Delete */}
              <button
                onClick={() => deleteNote(note.id)}
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={8} color="#d63031" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {notes.length === 0 && (
          <div className="flex items-center justify-center h-20" style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#636e72', textAlign: 'center', lineHeight: 2 }}>
            Write your tasks here<br />to stay focused!
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-2 flex gap-1 border-t" style={{ borderColor: 'rgba(108,92,231,0.3)' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add task..."
          className="flex-1 bg-transparent outline-none px-2 py-1"
          style={{
            fontFamily: '"Share Tech Mono"', fontSize: 10,
            color: '#dfe6e9', border: '1px solid rgba(108,92,231,0.3)',
            background: 'rgba(15,12,41,0.5)',
          }}
        />
        <button onClick={handleAdd} className="pixel-btn px-2 py-1 flex items-center">
          <Plus size={10} />
        </button>
      </div>

      {/* Progress */}
      {notes.length > 0 && (
        <div className="px-2 pb-2">
          <div className="flex justify-between mb-1">
            <span style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: '#636e72' }}>
              {notes.filter(n => n.completed).length}/{notes.length} done
            </span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(108,92,231,0.2)' }}>
            <div
              style={{
                height: '100%',
                width: `${(notes.filter(n => n.completed).length / notes.length) * 100}%`,
                background: '#55efc4',
                transition: 'width 0.3s',
              }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
