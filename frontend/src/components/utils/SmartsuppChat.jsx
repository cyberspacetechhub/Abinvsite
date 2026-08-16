// components/SmartsuppChat.js
import { useEffect } from 'react';

const SmartsuppChat = () => {
  useEffect(() => {
    // Set the global Smartsupp key
    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = '90ed25ab1becfb5947bb6e46232dd836ec22d303';

    // Load the Smartsupp script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://www.smartsuppchat.com/loader.js?';
    document.body.appendChild(script);

    // Optional: clean up on unmount
    return () => {
      delete window._smartsupp;
    };
  }, []);

  return null; // No visible output
};

export default SmartsuppChat;
