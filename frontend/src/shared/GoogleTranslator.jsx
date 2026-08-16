import { useEffect } from 'react';

const GoogleTranslator = () => {
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,es,fr,de,it,pt,ru,zh-CN,ja,ko', // Languages to include
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false // Prevents auto-display of the banner
        },
        'google_translate_element'
      );
    };

    addGoogleTranslateScript();

    return () => {
      // Cleanup
      const script = document.querySelector('script[src*="translate.google.com"]');
      if (script) {
        document.body.removeChild(script);
      }
      delete window.googleTranslateElementInit;
    };
  }, []);

  return (
    <div id="google_translate_element" style={{ 
      display: 'inline-block',
      verticalAlign: 'middle'
    }}></div>
  );
};

export default GoogleTranslator;