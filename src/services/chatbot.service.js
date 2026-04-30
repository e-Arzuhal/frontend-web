import ApiService from './api.service';

class ChatbotService {
  /**
   * Chatbot'a mesaj gönderir. Kullanıcı belirli bir sözleşme hakkında
   * konuşuyorsa contractId verilebilir. Belirtilmezse ve birden fazla
   * sözleşmesi varsa sunucu seçim yapması için contractOptions döndürür.
   */
  async sendMessage(message, history = [], contractId = null) {
    return ApiService.post('/api/chat', { message, history, contractId });
  }
}

const chatbotService = new ChatbotService();
export default chatbotService;
