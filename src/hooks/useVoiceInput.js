import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Web Speech API ile sesle yazma hook'u.
 * Harici kütüphane gerektirmez — tarayıcının native özelliğini kullanır.
 *
 * @param {Object} options
 * @param {string} options.lang - Dil kodu (varsayılan: 'tr-TR')
 * @param {boolean} options.continuous - Sürekli dinleme (varsayılan: true)
 * @param {function} options.onResult - Her tanınan metin parçası için callback
 * @param {function} options.onError - Hata callback'i
 */
export default function useVoiceInput({
  lang = 'tr-TR',
  continuous = true,
  onResult,
  onError,
} = {}) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);

  // Callback ref'lerini güncel tut (stale closure önleme)
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);

  // Tarayıcıda Web Speech API var mı?
  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript && onResultRef.current) {
        onResultRef.current(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'aborted') return; // Kullanıcı durdurdu, hata değil
      setIsListening(false);
      if (onErrorRef.current) {
        const messages = {
          'not-allowed': 'Mikrofon izni reddedildi. Tarayıcı ayarlarını kontrol edin.',
          'no-speech': 'Konuşma algılanamadı. Tekrar deneyin.',
          'network': 'Ağ hatası. İnternet bağlantınızı kontrol edin.',
        };
        onErrorRef.current(messages[event.error] || `Ses tanıma hatası: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isSupported, lang, continuous]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  return { isListening, isSupported, startListening, stopListening, toggleListening };
}
