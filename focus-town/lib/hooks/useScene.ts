'use client';
import { useEffect } from 'react';
import { SceneType, SCENE_PALETTES } from '../types';
import { useSceneStore } from '../store';

function getSceneFromHour(hour: number): SceneType {
  if (hour >= 5 && hour < 7)   return 'dawn';
  if (hour >= 7 && hour < 17)  return 'day';
  if (hour >= 17 && hour < 19) return 'dusk';
  return 'night';
}

export function useScene() {
  const { scene, setScene, autoScene } = useSceneStore();

  useEffect(() => {
    if (!autoScene) return;
    const update = () => {
      const hour = new Date().getHours();
      setScene(getSceneFromHour(hour));
    };
    update();
    const timer = setInterval(update, 5 * 60 * 1000); // check every 5 min
    return () => clearInterval(timer);
  }, [autoScene, setScene]);

  useEffect(() => {
    const palette = SCENE_PALETTES[scene];
    const root = document.documentElement;
    root.style.setProperty('--scene-sky',          palette.sky);
    root.style.setProperty('--scene-sky2',         palette.sky2);
    root.style.setProperty('--scene-horizon',      palette.horizon);
    root.style.setProperty('--scene-building-far', palette.buildingFar);
    root.style.setProperty('--scene-building-mid', palette.buildingMid);
    root.style.setProperty('--scene-building-near',palette.buildingNear);
    root.style.setProperty('--scene-window-lit',   palette.windowLit);
    root.style.setProperty('--scene-window-dark',  palette.windowDark);
    root.style.setProperty('--scene-ambient',      palette.ambientLight);
  }, [scene]);

  return { scene, palette: SCENE_PALETTES[scene] };
}
