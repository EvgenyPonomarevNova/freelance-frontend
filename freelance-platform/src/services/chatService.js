// services/chatService.js
import { apiService } from './api'

class ChatService {
  async getMessages(projectId, user1Id, user2Id) {
    try {
      if (!apiService.isMockMode) {
        return await apiService.request(`/chats/${projectId}/messages`)
      }
    } catch (error) {
      console.log('API недоступен, используем localStorage')
    }

    // Fallback на localStorage
    const chatKey = `chat_${projectId}_${user1Id}_${user2Id}`
    return JSON.parse(localStorage.getItem(chatKey) || '[]')
  }

  async sendMessage(projectId, messageData) {
    try {
      if (!apiService.isMockMode) {
        return await apiService.request(`/chats/${projectId}/messages`, {
          method: 'POST',
          body: JSON.stringify(messageData),
        })
      }
    } catch (error) {
      console.log('API недоступен, используем localStorage')
    }

    // Fallback на localStorage
    const chatKey = `chat_${projectId}_${messageData.senderId}_${messageData.receiverId}`
    const messages = JSON.parse(localStorage.getItem(chatKey) || '[]')
    
    const newMessage = {
      id: Date.now().toString(),
      ...messageData,
      timestamp: new Date().toISOString(),
      isRead: false
    }

    messages.push(newMessage)
    localStorage.setItem(chatKey, JSON.stringify(messages))
    
    return newMessage
  }

  async getChats(userId) {
    try {
      if (!apiService.isMockMode) {
        return await apiService.request(`/users/${userId}/chats`)
      }
    } catch (error) {
      console.log('API недоступен, используем localStorage')
    }

    // Fallback на localStorage - собираем все чаты пользователя
    const allChats = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith('chat_') && key.includes(userId)) {
        const messages = JSON.parse(localStorage.getItem(key) || '[]')
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1]
          const participants = key.split('_').slice(2) // Извлекаем ID участников
          const otherUserId = participants.find(id => id !== userId)
          
          allChats[key] = {
            id: key,
            lastMessage,
            unreadCount: messages.filter(m => !m.isRead && m.senderId !== userId).length,
            updatedAt: lastMessage.timestamp
          }
        }
      }
    }

    return Object.values(allChats)
  }
}

export const chatService = new ChatService()