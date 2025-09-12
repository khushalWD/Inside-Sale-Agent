// Type definitions for Salesforce Embedded Service
interface Window {
  _linkedin_data_partner_id?: string[];
  embedded_svc?: {
    settings: {
      organizationId: string;
      deploymentId: string;
      buttonId: string;
      baseLiveAgentContentURL: string;
      baseLiveAgentURL: string;
      serviceCloudDomain: string;
      eswLiveAgentDevName: string;
      isOfflineSupportEnabled: boolean;
    };
    init: () => void;
    showChatWindow: () => void;
    hideChatWindow: () => void;
  };
}
