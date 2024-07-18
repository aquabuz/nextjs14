import { RequestAppInfo } from "@/service/network/types/appInfo";

export function validateAppRegister(
  appInfo: RequestAppInfo
): RequestAppInfo[] | null {
  // 유효성 검사 결과를 담을 배열
  const errors: Array<{}> = [];

  console.log("appInfo::::", appInfo);

  // mem_id 검사
  const idRegex = /^[a-zA-Z]{1}[a-zA-Z0-9_]{4,20}$/;
  if (!idRegex.test(appInfo.mem_id)) {
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
  if (appInfo?.mem_pw) {
    if (
      !pwRegex.test(appInfo.mem_pw) ||
      /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(appInfo.mem_pw)
    ) {
      errors.push({
        mem_pw:
          "사용자 비밀번호는 8자에서 16자 사이이며, 영문 대 소문자, 숫자, 특수문자를 최소 1개씩 포함하고, 한글을 포함하면 안 됩니다.",
      });
    }
  }

  // mem_pw_confirm 검사
  if (appInfo?.mem_pw && appInfo?.mem_pw_confirm) {
    if (appInfo.mem_pw !== appInfo.mem_pw_confirm) {
      errors.push({
        mem_pw_confirm: "비밀번호가 일치하지 않습니다.",
      });
    }
  }

  // 에러가 있는 경우 에러 메시지 반환, 없으면 null 반환
  if (errors.length > 0) {
    return errors as any;
  }

  return null;
}
