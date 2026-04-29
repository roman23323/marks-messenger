export class AcknowledgeMessageDto {
    status: 'received' | 'error';
    code?: 'VALIDATION_FAILED' | 'UNKNOWN_ERROR';
    errors?: string | Record<string, string[]>;
    requestId: string;
}