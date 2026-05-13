'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopItem } from '@/lib/types';
import { useUserStore } from '@/lib/store';
import { Star, Lock } from 'lucide-react';

const CAR_SKINS: ShopItem[] = [
  { id: 'skin_retro',   name: 'Retro Pixel',    description: 'Classic pixel-art style',   price_nt: 99,  item_type: 'car_skin', preview_color: '#6c5ce7', is_pro_only: false },
  { id: 'skin_neon',    name: 'Neon Racer',     description: 'Glowing neon lights',       price_nt: 149, item_type: 'car_skin', preview_color: '#00b894', is_pro_only: false },
  { id: 'skin_golden',  name: 'Golden Focus',   description: 'For top performers',        price_nt: 299, item_type: 'car_skin', preview_color: '#fdcb6e', is_pro_only: true },
  { id: 'skin_galaxy',  name: 'Galaxy Drive',   description: 'Stars follow your car',     price_nt: 399, item_type: 'car_skin', preview_color: '#a29bfe', is_pro_only: true },
];

const WEATHER_THEMES: ShopItem[] = [
  { id: 'theme_sakura',  name: 'Sakura Spring', description: 'Cherry blossoms scene',     price_nt: 199, item_type: 'weather_theme', preview_color: '#fd79a8', is_pro_only: false },
  { id: 'theme_winter',  name: 'Snow City',     description: 'Peaceful winter town',      price_nt: 199, item_type: 'weather_theme', preview_color: '#74b9ff', is_pro_only: false },
  { id: 'theme_aurora',  name: 'Aurora Night',  description: 'Northern lights city',      price_nt: 399, item_type: 'weather_theme', preview_color: '#55efc4', is_pro_only: true },
];

const PRO_PLAN: ShopItem = {
  id: 'pro_monthly', name: 'Focus+', description: 'Who Liked You · Advanced Analytics · All Themes',
  price_nt: 129, item_type: 'pro_subscription', is_pro_only: false,
};

function ShopItemCard({ item, owned, onBuy }: { item: ShopItem; owned?: boolean; onBuy: (item: ShopItem) => void }) {
  const { profile } = useUserStore();
  const locked = item.is_pro_only && !profile?.is_pro;

  return (
    <motion.div
      className="pixel-card p-3 relative"
      whileHover={{ y: -2 }}
    >
      {locked && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="text-center">
            <Lock size={16} color="#fdcb6e" />
            <div style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: '#fdcb6e', marginTop: 4 }}>PRO ONLY</div>
          </div>
        </div>
      )}

      {/* Preview */}
      {item.preview_color && (
        <div style={{ height: 32, background: item.preview_color, marginBottom: 8, boxShadow: `0 0 12px ${item.preview_color}60` }} />
      )}

      <div style={{ fontFamily: '"Press Start 2P"', fontSize: 7, color: '#dfe6e9', marginBottom: 4 }}>
        {item.name}
      </div>
      <div style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: '#636e72', marginBottom: 8, lineHeight: 1.6 }}>
        {item.description}
      </div>

      <div className="flex items-center justify-between">
        <span style={{ fontFamily: '"Press Start 2P"', fontSize: 7, color: '#ffeaa7' }}>
          NT${item.price_nt}
        </span>
        {owned ? (
          <span style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: '#55efc4', padding: '2px 6px', border: '1px solid #55efc4' }}>
            OWNED
          </span>
        ) : (
          <button
            onClick={() => !locked && onBuy(item)}
            className="pixel-btn px-2 py-1"
            style={{ fontSize: 6 }}
            disabled={locked}
          >
            BUY
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function ProShop() {
  const [tab, setTab] = useState<'cars' | 'weather' | 'pro'>('cars');
  const { profile } = useUserStore();

  const handleBuy = (item: ShopItem) => {
    // In production, this would go through Stripe
    alert(`購買功能即將開放！\n${item.name} - NT$${item.price_nt}/mo`);
  };

  const tabs = [
    { id: 'cars',    label: '🚗 Cars' },
    { id: 'weather', label: '🌤 Weather' },
    { id: 'pro',     label: '⭐ Pro' },
  ];

  return (
    <div className="min-h-screen p-6" style={{ background: 'rgba(15,12,41,0.95)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 style={{ fontFamily: '"Press Start 2P"', fontSize: 16, color: '#ffeaa7', marginBottom: 8 }}>
            🏪 PRO SHOP
          </h1>
          <p style={{ fontFamily: '"Press Start 2P"', fontSize: 7, color: '#a29bfe', lineHeight: 2 }}>
            Customize your Focus Town experience
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className="flex-1 py-2 text-center"
              style={{
                fontFamily: '"Press Start 2P"', fontSize: 7,
                background: tab === t.id ? '#6c5ce7' : 'rgba(255,255,255,0.05)',
                color: tab === t.id ? 'white' : '#636e72',
                border: `2px solid ${tab === t.id ? '#a29bfe' : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {tab === 'cars' && (
            <motion.div key="cars" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              {CAR_SKINS.map(item => (
                <ShopItemCard key={item.id} item={item} onBuy={handleBuy} />
              ))}
            </motion.div>
          )}

          {tab === 'weather' && (
            <motion.div key="weather" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              {WEATHER_THEMES.map(item => (
                <ShopItemCard key={item.id} item={item} onBuy={handleBuy} />
              ))}
            </motion.div>
          )}

          {tab === 'pro' && (
            <motion.div key="pro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Pro plan card */}
              <div className="pixel-card p-6 text-center mb-6" style={{ border: '2px solid #fdcb6e', boxShadow: '0 0 20px rgba(253,203,110,0.3)' }}>
                <div style={{ fontFamily: '"Press Start 2P"', fontSize: 20, color: '#fdcb6e', marginBottom: 8 }}>⭐ Focus+</div>
                <div style={{ fontFamily: '"Press Start 2P"', fontSize: 24, color: 'white', marginBottom: 4 }}>NT$129</div>
                <div style={{ fontFamily: '"Press Start 2P"', fontSize: 7, color: '#a29bfe', marginBottom: 16 }}>/month</div>

                <ul className="space-y-2 mb-6 text-left max-w-xs mx-auto">
                  {[
                    '👁 Who Liked You',
                    '📊 Advanced Focus Analytics',
                    '🌈 All Weather Themes',
                    '🚗 Golden & Galaxy Car Skins',
                    '🏆 Focus Hall of Fame badge',
                    '💬 Unlimited Co-focus rooms',
                  ].map(f => (
                    <li key={f} style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#dfe6e9', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {f}
                    </li>
                  ))}
                </ul>

                {profile?.is_pro ? (
                  <div style={{ fontFamily: '"Press Start 2P"', fontSize: 8, color: '#55efc4', padding: '8px 16px', border: '2px solid #55efc4', display: 'inline-block' }}>
                    ✓ YOU ARE PRO!
                  </div>
                ) : (
                  <button onClick={() => handleBuy(PRO_PLAN)} className="pixel-btn w-full py-3" style={{ fontSize: 9, background: '#fdcb6e', color: '#2d3436', border: '2px solid #e17055' }}>
                    UPGRADE TO FOCUS+
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
