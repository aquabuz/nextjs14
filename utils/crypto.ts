import CryptoJS from "crypto-js";

// CryptoJS AES 암호화 키
const CRYPTO_SECRET_KEY = String(process.env.CRYPTO_SECRET_KEY); // 암호화에 사용할 키

// 데이터를 암호화하여 sessionStorage에 저장하는 함수
export function saveToSessionStorage(
  key: string,
  data: { [key: string]: string }
) {
  // 데이터를 JSON 문자열로 변환
  const jsonData = JSON.stringify(data);

  // AES로 데이터 암호화
  const encryptedData = CryptoJS.AES.encrypt(
    jsonData,
    CRYPTO_SECRET_KEY
  ).toString();

  // 암호화된 데이터를 sessionStorage에 저장
  sessionStorage.setItem(key, encryptedData);
}

// sessionStorage에서 암호화된 데이터를 복호화하여 가져오는 함수
export function getFromSessionStorage(key: string) {
  // sessionStorage에서 데이터 가져오기
  const encryptedData = sessionStorage.getItem(key);

  if (encryptedData) {
    // AES로 데이터 복호화
    const decryptedBytes = CryptoJS.AES.decrypt(
      encryptedData,
      CRYPTO_SECRET_KEY
    );
    const decryptedData = JSON.parse(
      decryptedBytes.toString(CryptoJS.enc.Utf8)
    );

    return decryptedData;
  }

  return null;
}
