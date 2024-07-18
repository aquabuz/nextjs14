export interface RequestMember {
  idx?: number;
  mem_id: string;
  mem_pw: string;
  name: string;
  status?: number;
  push_token?: string;
  login_type?: number;
}
export interface ResponseMember {
  idx?: number;
  mem_id: string;
  mem_pw: string;
  name: string;
  status?: number;
  push_token?: string;
  login_type?: number;
}
