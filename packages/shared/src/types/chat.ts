export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  success: true;
  data: {
    message: string;
    model: string;
  };
}