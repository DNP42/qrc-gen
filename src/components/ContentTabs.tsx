'use client';

import { useId, useState } from 'react';
import {
  encodeUrl,
  encodeVCard,
  encodeWifi,
  type UrlInput,
  type VCardInput,
  type WifiEncryption,
  type WifiInput,
} from '@/lib/formatters';
import { useDict, useLocale } from '@/i18n/I18nProvider';
import { plural } from '@/i18n/format';
import { DEFAULT_CONFIG } from '@/lib/qr';

export type ContentType = 'url' | 'wifi' | 'vcard';

interface Props {
  onChange: (data: string, type: ContentType) => void;
}

const TABS: ContentType[] = ['url', 'wifi', 'vcard'];

const WIFI_ENCRYPTIONS: WifiEncryption[] = ['WPA', 'WEP', 'nopass'];

export function ContentTabs({ onChange }: Props) {
  const t = useDict();
  const [active, setActive] = useState<ContentType>('url');

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label={t.cards.content}>
        {TABS.map((id) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className="chip"
            aria-pressed={active === id}
            type="button"
          >
            {t.content.tabs[id]}
          </button>
        ))}
      </div>

      {active === 'url' && <UrlForm onChange={(s) => onChange(s, 'url')} />}
      {active === 'wifi' && <WifiForm onChange={(s) => onChange(s, 'wifi')} />}
      {active === 'vcard' && <VCardForm onChange={(s) => onChange(s, 'vcard')} />}
    </div>
  );
}

function UrlForm({ onChange }: { onChange: (s: string) => void }) {
  const t = useDict().content.url;
  const id = useId();
  const locale = useLocale();
  const [input, setInput] = useState<UrlInput>({ text: DEFAULT_CONFIG.data });

  const update = (next: UrlInput) => {
    setInput(next);
    onChange(encodeUrl(next));
  };

  return (
    <div>
      <label className="label" htmlFor={`${id}-url`}>{t.label}</label>
      <textarea
        id={`${id}-url`}
        className="field"
        rows={4}
        value={input.text}
        onChange={(e) => update({ text: e.target.value })}
        placeholder={t.placeholder}
      />
      <p className="mt-2 font-mono text-sm text-[var(--muted)]" aria-live="polite">
        {t.encodedAs} {plural(locale, input.text.length, t.charCount)}.
      </p>
    </div>
  );
}

function WifiForm({ onChange }: { onChange: (s: string) => void }) {
  const t = useDict().content.wifi;
  const id = useId();
  const [input, setInput] = useState<WifiInput>({
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
  });

  const update = (next: WifiInput) => {
    setInput(next);
    onChange(encodeWifi(next));
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="label" htmlFor={`${id}-ssid`}>{t.ssid}</label>
        <input
          id={`${id}-ssid`}
          className="field"
          value={input.ssid}
          onChange={(e) => update({ ...input, ssid: e.target.value })}
          placeholder={t.ssidPlaceholder}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor={`${id}-enc`}>{t.encryption}</label>
          <select
            id={`${id}-enc`}
            className="field"
            value={input.encryption}
            onChange={(e) =>
              update({ ...input, encryption: e.target.value as WifiEncryption })
            }
          >
            {WIFI_ENCRYPTIONS.map((enc) => (
              <option key={enc} value={enc}>
                {t.encryptionOptions[enc]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span className="label" id={`${id}-hid`}>{t.hidden}</span>
          <button
            type="button"
            aria-labelledby={`${id}-hid`}
            aria-pressed={input.hidden}
            onClick={() => update({ ...input, hidden: !input.hidden })}
            className={`field text-left ${input.hidden ? 'text-[var(--hawk)]' : ''}`}
          >
            {input.hidden ? `● ${t.yes}` : `○ ${t.no}`}
          </button>
        </div>
      </div>
      {input.encryption !== 'nopass' && (
        <div>
          <label className="label" htmlFor={`${id}-pw`}>{t.password}</label>
          <input
            id={`${id}-pw`}
            type="text"
            className="field"
            value={input.password}
            onChange={(e) => update({ ...input, password: e.target.value })}
            placeholder="••••••••"
          />
        </div>
      )}
    </div>
  );
}

function VCardForm({ onChange }: { onChange: (s: string) => void }) {
  const t = useDict().content.vcard;
  const id = useId();
  const [input, setInput] = useState<VCardInput>({
    firstName: '',
    lastName: '',
    organization: '',
    title: '',
    phone: '',
    email: '',
    url: '',
  });

  const update = (next: VCardInput) => {
    setInput(next);
    onChange(encodeVCard(next));
  };

  const field = (key: keyof VCardInput) => (
    <div>
      <label className="label" htmlFor={`${id}-${key}`}>{t[key].label}</label>
      <input
        id={`${id}-${key}`}
        className="field"
        value={input[key]}
        onChange={(e) => update({ ...input, [key]: e.target.value })}
        placeholder={t[key].placeholder}
      />
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {field('firstName')}
        {field('lastName')}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {field('organization')}
        {field('title')}
      </div>
      {field('phone')}
      {field('email')}
      {field('url')}
    </div>
  );
}
