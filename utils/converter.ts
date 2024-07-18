/**
 * @description 전화번호 하이픈 자동 정규식
 * @param {String} '000000000' || '00000000000'
 * @returns '00-000-0000' || '000-0000-0000'
 */
export const regexPhoneNumber = (target: string) => {
  if (target) {
    return target
      .replace(/[^0-9]/g, "")
      .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
  } else {
    return "-";
  }
};
