export interface ChatMessage {
    type: 'processing' | 'new-message' | 'error',
    roomId: string,
    userId: number,
    data?: {
        id: string,
        text: string,
    }
}