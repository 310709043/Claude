/* App root — wires screens, language, tweaks, navigation */
(function () {
  const { LoginScreen, CharacterScreen, TownScreen, SoloRoomScreen, BuddyRoomScreen } = window;
  const { TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle, TweakSelect } = window;

  const DEFAULTS = /*EDITMODE-BEGIN*/{
    "direction": "neon",
    "autoTime": true,
    "startScreen": "town",
    "showScanlines": true,
    "lang": "zh"
  }/*EDITMODE-END*/;

  function App() {
    const [tweaks, setTweak] = useTweaks(DEFAULTS);
    const [screen, setScreen] = React.useState(tweaks.startScreen || 'login');
    const [profile, setProfile] = React.useState({
      name: 'Yuki',
      avatar: window.AVATARS?.[0],
      level: 4,
      interests: ['coding', 'lofi', 'tea'],
      skills: ['frontend', 'design'],
      goal: 4,
    });

    React.useEffect(() => {
      document.documentElement.dataset.direction = tweaks.direction || 'neon';
    }, [tweaks.direction]);

    React.useEffect(() => {
      setScreen(tweaks.startScreen || 'login');
    }, [tweaks.startScreen]);

    React.useEffect(() => {
      const s = document.getElementById('scan-toggle') || (() => {
        const el = document.createElement('style'); el.id = 'scan-toggle'; document.head.appendChild(el); return el;
      })();
      s.textContent = tweaks.showScanlines ? '' : `.crt::before { display: none !important; }`;
    }, [tweaks.showScanlines]);

    const setLang = (l) => setTweak('lang', l);
    const go = (s) => setScreen(s);

    return (
      <>
        {screen === 'login' && (
          <LoginScreen direction={tweaks.direction} lang={tweaks.lang} setLang={setLang}
            onLogin={(p) => { setProfile({ ...profile, ...p }); go('character'); }} />
        )}
        {screen === 'character' && (
          <CharacterScreen direction={tweaks.direction} lang={tweaks.lang} setLang={setLang}
            onBack={() => go('login')}
            onContinue={(p) => { setProfile({ ...profile, ...p }); go('town'); }} />
        )}
        {screen === 'town' && (
          <TownScreen profile={profile} direction={tweaks.direction}
            lang={tweaks.lang} setLang={setLang}
            autoTime={tweaks.autoTime}
            onLogout={() => go('login')}
            onOpenSolo={() => go('solo')}
            onOpenBuddy={() => go('buddy')} />
        )}
        {screen === 'solo' && (
          <SoloRoomScreen profile={profile} lang={tweaks.lang} setLang={setLang}
            onExit={() => go('town')} />
        )}
        {screen === 'buddy' && (
          <BuddyRoomScreen profile={profile} lang={tweaks.lang} setLang={setLang}
            onExit={() => go('town')} />
        )}

        <TweaksPanel title="Tweaks">
          <TweakSection label="畫面導覽">
            <TweakRadio label="當前畫面" value={screen} onChange={go} options={[
              { value: 'login', label: '登入' },
              { value: 'character', label: '註冊' },
              { value: 'town', label: '小鎮' },
              { value: 'solo', label: '個人' },
              { value: 'buddy', label: '夥伴' },
            ]} />
            <TweakRadio label="語言" value={tweaks.lang} onChange={setLang} options={[
              { value: 'zh', label: '中文' },
              { value: 'en', label: 'EN' },
              { value: 'ko', label: '한국' },
              { value: 'ja', label: '日本' },
            ]} />
          </TweakSection>

          <TweakSection label="視覺方向">
            <TweakRadio
              label="風格"
              value={tweaks.direction}
              onChange={(v) => setTweak('direction', v)}
              options={[
                { value: 'neon', label: 'Neon' },
                { value: 'dusk', label: 'Dusk' },
                { value: 'rain', label: 'Rain' },
              ]}
            />
          </TweakSection>

          <TweakSection label="氛圍">
            <TweakToggle label="時段自動切換" value={tweaks.autoTime} onChange={(v) => setTweak('autoTime', v)} />
            <TweakToggle label="CRT 掃描線" value={tweaks.showScanlines} onChange={(v) => setTweak('showScanlines', v)} />
          </TweakSection>
        </TweaksPanel>
      </>
    );
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
})();
