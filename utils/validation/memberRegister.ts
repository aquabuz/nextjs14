import { RequestRoomChatbot } from "@/service/network/types/chatbot";
import { RequestMember } from "@/service/network/types/member";

export function validateUser(user: RequestMember): Array<{}> | null {
  // 유효성 검사 결과를 담을 배열
  const errors: Array<{}> = [];

  // mem_id 검사
  const idRegex = /^[a-zA-Z]{1}[a-zA-Z0-9_]{4,20}$/;
  if (!idRegex.test(user.mem_id)) {
    errors.push({
      mem_id:
        "사용자 아이디는 시작은 영문자, 특수문자를 제외한 영문, 숫자, '_' 사용, 4자 초과 20자 사이어야 합니다.",
    });
  }

  // mem_pw 검사
  // 사용자 비밀번호는 8자에서 16자 사이이며, 영문 대 소문자, 숫자, 특수문자를 최소 1개씩 포함해야 합니다.
  const pwRegex =
    /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$)[0-9a-zA-Z\W]{8,16}$/;
  // 추가적인 한글 포함 검사
  if (!pwRegex.test(user.mem_pw) || /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(user.mem_pw)) {
    errors.push({
      mem_pw:
        "사용자 비밀번호는 8자에서 16자 사이이며, 영문 대 소문자, 숫자, 특수문자를 최소 1개씩 포함하고, 한글을 포함하면 안 됩니다.",
    });
  }

  // name 검사
  // const nameRegex = /^[ㄱ-ㅎ가-힣a-z]{2,10}$/;
  const nameRegex = /^[가-힣a-z]{2,10}$/;
  if (!nameRegex.test(user.name)) {
    errors.push({
      name: "이름은 2자에서 10자 사이의 한글 또는 영문 소문자만 허용됩니다.",
    });
  }

  // status 검사
  if (!Number.isInteger(user.status)) {
    errors.push({
      // status: "status는 정수여야 합니다.",
      status: "상태를 선택해주세요.",
    });
  }

  // login_type 검사
  if (
    !Number.isInteger(user.status) ||
    (user.login_type !== 0 && user.login_type !== 1 && user.login_type !== 2)
  ) {
    errors.push({
      // login_type: "로그인 타입은 0 또는 1 또는 2이어야 합니다.",
      login_type: "로그인 타입을 선택해주세요.",
    });
  }

  // 에러가 있는 경우 에러 메시지 반환, 없으면 null 반환
  if (errors.length > 0) {
    return errors;
  }

  return null;
}

export function validateRoomChatbot(obj: RequestRoomChatbot): Array<{}> | null {
  // 유효성 검사 결과를 담을 배열
  const errors: Array<{}> = [];

  // game_idx 검사
  if (!obj.game_idx) {
    errors.push({
      game_idx: "대회를 선택해주세요.",
    });
  }

  // 에러가 있는 경우 에러 메시지 반환, 없으면 null 반환
  if (errors.length > 0) {
    return errors;
  }

  return null;
}
