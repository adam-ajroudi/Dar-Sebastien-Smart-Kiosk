'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { SupportedLanguage, GREETING_MESSAGES, SUGGESTED_QUESTIONS } from '@/lib/ai/persona';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

interface ChatInterfaceProps {
    language: SupportedLanguage;
    onLanguageChange: (lang: SupportedLanguage) => void;
    onClose: () => void;
}

export default function ChatInterface({
    language,
    onLanguageChange,
    onClose
}: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'greeting',
            role: 'assistant',
            content: GREETING_MESSAGES[language]
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);
    const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-scroll to latest message
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Reset inactivity timer
    const resetInactivityTimer = useCallback(() => {
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }
        // Return to idle after 3 minutes of inactivity
        inactivityTimerRef.current = setTimeout(() => {
            onClose();
        }, 180000);
    }, [onClose]);

    useEffect(() => {
        resetInactivityTimer();
        return () => {
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
        };
    }, [resetInactivityTimer]);

    // Update greeting when language changes
    useEffect(() => {
        setMessages([{
            id: 'greeting',
            role: 'assistant',
            content: GREETING_MESSAGES[language]
        }]);
    }, [language]);

    // Initialize Web Speech API
    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const SpeechRecognitionClass = (window as any).webkitSpeechRecognition;
            const recognition = new SpeechRecognitionClass();
            recognitionRef.current = recognition;
            recognition.continuous = false;
            recognition.interimResults = false;

            const langCodes: Record<SupportedLanguage, string> = {
                ar: 'ar-TN',
                fr: 'fr-FR',
                en: 'en-US'
            };
            recognition.lang = langCodes[language];

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
            };

            recognition.onerror = () => {
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };
        }
    }, [language]);

    const handleSend = async (text: string = input) => {
        if (!text.trim() || isLoading) return;

        resetInactivityTimer();

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text.trim(),
                    history: messages.slice(-10).map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                })
            });

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.message || 'I apologize, but I could not process your request.'
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessages: Record<SupportedLanguage, string> = {
                ar: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
                fr: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
                en: 'Sorry, an error occurred. Please try again.'
            };

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: errorMessages[language]
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleVoiceInput = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
            resetInactivityTimer();
        }
    };

    const isRTL = language === 'ar';
    const suggestions = SUGGESTED_QUESTIONS[language];

    return (
        <div className="kiosk-container" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Header */}
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-md) var(--space-lg)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(10, 22, 40, 0.9)',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    {/* Logo placeholder */}
                    <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: 'var(--radius-full)',
                        background: 'linear-gradient(135deg, var(--color-gold) 0%, var(--color-terracotta) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: 'var(--color-dark)'
                    }}>
                        DS
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '2px' }}>Dar Sebastien</h2>
                        <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Virtual Guide</p>
                    </div>
                </div>

                {/* Language Selector */}
                <div className="language-selector">
                    {(['ar', 'fr', 'en'] as SupportedLanguage[]).map(lang => (
                        <button
                            key={lang}
                            className={`lang-btn ${language === lang ? 'active' : ''}`}
                            onClick={() => onLanguageChange(lang)}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Close Button */}
                <button
                    className="btn btn-secondary btn-icon"
                    onClick={onClose}
                    style={{ width: 48, height: 48 }}
                    aria-label="Close chat"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </header>

            {/* Messages Area */}
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div
                        key={message.id}
                        className={`message message-${message.role}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <p className="message-text">{message.content}</p>
                    </div>
                ))}

                {isLoading && (
                    <div className="message message-assistant">
                        <div className="loading-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length <= 2 && (
                <div style={{
                    padding: 'var(--space-md) var(--space-lg)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 'var(--space-sm)'
                }}>
                    {suggestions.map((question, index) => (
                        <button
                            key={index}
                            className="suggestion-btn"
                            onClick={() => handleSend(question)}
                            disabled={isLoading}
                        >
                            {question}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div style={{
                padding: 'var(--space-lg)',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(10, 22, 40, 0.95)',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{
                    display: 'flex',
                    gap: 'var(--space-md)',
                    alignItems: 'center',
                    maxWidth: 1000,
                    margin: '0 auto'
                }}>
                    {/* Voice Input Button */}
                    <button
                        className={`voice-btn ${isListening ? 'recording' : ''}`}
                        onClick={toggleVoiceInput}
                        aria-label={isListening ? 'Stop recording' : 'Start voice input'}
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                            <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                            <path d="M12 19v3" />
                        </svg>
                    </button>

                    {/* Text Input */}
                    <input
                        ref={inputRef}
                        type="text"
                        className="input-field"
                        placeholder={
                            language === 'ar' ? 'اكتب سؤالك هنا...' :
                                language === 'fr' ? 'Tapez votre question ici...' :
                                    'Type your question here...'
                        }
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            resetInactivityTimer();
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        disabled={isLoading}
                        style={{ flex: 1 }}
                    />

                    {/* Send Button */}
                    <button
                        className="btn btn-primary btn-icon"
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading}
                        style={{ width: 64, height: 64 }}
                        aria-label="Send message"
                    >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 2L11 13" />
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
