'use client';

import { useState } from 'react';
import IdleScreen from '@/components/IdleScreen';
import ChatInterface from '@/components/ChatInterface';
import { SupportedLanguage } from '@/lib/ai/persona';

export default function Home() {
  const [isActive, setIsActive] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  return (
    <main className="kiosk-container">
      {isActive ? (
        <ChatInterface
          language={language}
          onLanguageChange={setLanguage}
          onClose={() => setIsActive(false)}
        />
      ) : (
        <IdleScreen
          language={language}
          onLanguageChange={setLanguage}
          onStart={() => setIsActive(true)}
        />
      )}
    </main>
  );
}
