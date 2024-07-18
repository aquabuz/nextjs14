export interface RequestChatbotVo {
  idx?: number;
  store_idx: number;
  room_name: string;
  admins: string;
  welcome?: string;
  app_idx: number;
}

export interface RequestRoomChatbot {
  idx?: number;
  cb_store_idx: number;
  game_idx: number;
  [key: string]: string | number | undefined;
}

export interface RequestDeleteVo {
  idx: number | undefined;
  store_idx?: number | undefined; // 관리자가 room 삭제 시
}
