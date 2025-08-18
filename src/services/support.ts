export interface SupportConfig {
  webhookUrl: string;
  privateWebhookUrl: string;
  apiTimeout: number;
}

export const DEFAULT_SUPPORT_CONFIG: SupportConfig = {
  webhookUrl: 'http://172.30.3.29:5678/webhook/d10fafea-c33a-4bbb-b24a-f498acd66b91',
  privateWebhookUrl: 'http://172.30.3.29:5678/webhook/private/d10fafea-c33a-4bbb-b24a-f498acd66b91',
  apiTimeout: 100000,
};

export class SupportService {
  private config: SupportConfig;

  constructor(config: Partial<SupportConfig> = {}) {
    this.config = { ...DEFAULT_SUPPORT_CONFIG, ...config };
  }

  async sendMessage(message: string, userContext?: any): Promise<string> {
    return this.sendToPublicWebhook(message, userContext);
  }

  async sendPrivateMessage(message: string, cedula: string, userContext?: any): Promise<string> {
    return this.sendToPrivateWebhook(message, cedula, userContext);
  }


  private async sendToPublicWebhook(message: string, userContext?: any): Promise<string> {
    return this.sendWebhookRequest(this.config.webhookUrl, message, userContext);
  }

  private async sendToPrivateWebhook(message: string, cedula: string, userContext?: any): Promise<string> {
    return this.sendWebhookRequest(this.config.privateWebhookUrl, message, userContext, cedula);
  }

  private async sendWebhookRequest(url: string, message: string, userContext?: any, cedula?: string): Promise<string> {
    try {
      const formData = new URLSearchParams();
      formData.append('message', message);
      formData.append('channel', 'whatsapp');
      formData.append('recipient', userContext?.phone || '593939981766');
      formData.append('session_id', userContext?.sessionId || '1234');
      
      if (cedula) {
        formData.append('cedula', cedula);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      console.log(`Webhook ${cedula ? 'private' : 'public'}:`, formData.toString());

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      return responseData.message || "Mensaje recibido. Te responderemos pronto.";

    } catch (error) {
      console.error('Error al enviar mensaje al webhook:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return "El servicio está tardando en responder. Por favor intenta nuevamente.";
        }
        return `Error de conexión: ${error.message}`;
      }
      
      return "Lo siento, ocurrió un error. Por favor intenta nuevamente.";
    }
  }

  updateConfig(newConfig: Partial<SupportConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): SupportConfig {
    return { ...this.config };
  }
}

export const supportService = new SupportService();