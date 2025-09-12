import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';

declare global {
  interface Window {
    embeddedservice_bootstrap?: {
      settings: {
        language: string;
      };
      init: (
        orgId: string,
        embeddedServiceName: string,
        baseUrl: string,
        settings: {
          scrt2URL: string;
        }
      ) => void;
    };
  }
}

const SalesforceChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const initEmbeddedMessaging = () => {
    try {
      if (window.embeddedservice_bootstrap) {
        window.embeddedservice_bootstrap.settings.language = 'en_US';
        window.embeddedservice_bootstrap.init(
          '00DgL0000043RKj',
          'SalesInside',
          'https://orgfarm-427362ef72-dev-ed.develop.my.site.com/ESWSalesInside1757679456115',
          {
            scrt2URL: 'https://orgfarm-427362ef72-dev-ed.develop.my.salesforce-scrt.com'
          }
        );
        setIsInitialized(true);
      }
    } catch (err) {
      console.error('Error loading Embedded Messaging: ', err);
    }
  };

  useEffect(() => {
    // Load the Salesforce Embedded Messaging script
    const script = document.createElement('script');
    script.src = 'https://orgfarm-427362ef72-dev-ed.develop.my.site.com/ESWSalesInside1757679456115/assets/js/bootstrap.min.js';
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
      initEmbeddedMessaging();
    };
    script.onerror = (error) => {
      console.error('Error loading Salesforce Embedded Messaging script:', error);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const toggleChat = () => {
    // The actual chat toggle will be handled by the Salesforce script
    // This is just a UI indicator
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={toggleChat}
        className={`rounded-full h-14 w-14 p-0 flex items-center justify-center shadow-lg ${
          isOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
    </div>
  );
};

export default SalesforceChatWidget;
