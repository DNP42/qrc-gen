'use client';

import { useEffect, useState } from 'react';
import { useDict } from '@/i18n/I18nProvider';
import { isSoundOn, playSuccess, saveSoundChoice } from '@/lib/sound';

export function SoundToggle() {
  const t = useDict().sound;
  const [on, setOn] = useState(false);

  // Read the saved choice after mount, so server and client HTML match.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOn(isSoundOn());
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    saveSoundChoice(next);
    if (next) playSuccess();
  };

  return (
    <button type="button" className="chip" aria-pressed={on} onClick={toggle}>
      {on ? t.on : t.off}
    </button>
  );
}
