
export interface LoginRequest {
  username: string;     
  password: string;     
}

export interface AuthResponse {
  token: string;        
  username: string;     
  userType: number;     
  message: string;      
}

export interface RegisterRequest {
  id: number;          
  username: string;    
  email: string;       
  password: string;    
  address: string;      
  userType: number;     
}