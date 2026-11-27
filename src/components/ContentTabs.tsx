'use client';

import type { UrlInput, VCardInput, WifiEncryption, WifiInput } from '@/lib/formatters';
import { useDict, useLocale } from '@/i18n/I18nProvider';
import { plural } from '@/i18n/format';
import { CONTENT_TYPES, type ContentState } from '@/lib/content';

export type { ContentType } from '@/lib/content';

interface Props {
  value: ContentState;
  onChange: (next: ContentState) => void;
}

const TABS = CONTENT_TYPES;

const WIFI_ENCRYPTIONS: WifiEncryption[] = ['WPA', 'WEP', 'nopass'];

export function ContentTabs({ value, onChange }: Props) {
  const t = useDict();
  const active = value.type;

  return (
    <div>
      <div className="flex gap-1 mb-4 border-b border-[var(--border)]">
        {TABS.map((id) => (
          <button
            key={id}
            onClick={() => onChange({ ...value, type: id })}
            className={`px-3 py-2 font-mono text-xs uppercase tracking-wider border-b-2 transition-colors ${
              active === id
                ? 'border-[var(--hawk)] text-[var(--hawk)]'
                : 'border-transparent text-[var(--muted)] hover:text-white'
            }`}
            type="button"
          >
            {t.content.tabs[id]}
          </button>
        ))}
      </div>

      {active === 'url' && (
        <UrlForm input={value.url} onChange={(url) => onChange({ ...value, url })} />
      )}
      {active === 'wifi' && (
        <WifiForm input={value.wifi} onChange={(wifi) => onChange({ ...value, wifi })} />
      )}
      {active === 'vcard' && (
        <VCardForm input={value.vcard} onChange={(vcard) => onChange({ ...value, vcard })} />
      )}
    </div>
  );
}

function UrlForm({ input, onChange }: { input: UrlInput; onChange: (next: UrlInput) => void }) {
  const t = useDict().content.url;
  const locale = useLocale();
  const update = onChange;

  return (
    <div>
      <label className="label">{t.label}</label>
      <textarea
        className="field"
        rows={4}
        value={input.text}
        onChange={(e) => update({ text: e.target.value })}
        placeholder={t.placeholder}
      />
      <p className="mt-2 font-mono text-xs text-[var(--muted)]">
        {t.encodedAs} {plural(locale, input.text.length, t.charCount)}.
      </p>
    </div>
  );
}

function WifiForm({ input, onChange }: { input: WifiInput; onChange: (next: WifiInput) => void }) {
  const t = useDict().content.wifi;
  const update = onChange;

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t.ssid}</label>
        <input
          className="field"
          value={input.ssid}
          onChange={(e) => update({ ...input, ssid: e.target.value })}
          placeholder={t.ssidPlaceholder}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">{t.encryption}</label>
          <select
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
          <label className="label">{t.hidden}</label>
          <button
            type="button"
            onClick={() => update({ ...input, hidden: !input.hidden })}
            className={`field text-left ${input.hidden ? 'text-[var(--hawk)]' : ''}`}
          >
            {input.hidden ? `● ${t.yes}` : `○ ${t.no}`}
          </button>
        </div>
      </div>
      {input.encryption !== 'nopass' && (
        <div>
          <label className="label">{t.password}</label>
          <input
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

function VCardForm({ input, onChange }: { input: VCardInput; onChange: (next: VCardInput) => void }) {
  const t = useDict().content.vcard;
  const update = onChange;

  const field = (key: keyof VCardInput) => (
    <div>
      <label className="label">{t[key].label}</label>
      <input
        className="field"
        value={input[key]}
        onChange={(e) => update({ ...input, [key]: e.target.value })}
        placeholder={t[key].placeholder}
      />
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {field('firstName')}
        {field('lastName')}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field('organization')}
        {field('title')}
      </div>
      {field('phone')}
      {field('email')}
      {field('url')}
    </div>
  );
}
