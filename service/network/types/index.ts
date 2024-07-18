// export interface storeResponse {
//   data: {
//     [keys: string]: any;
//   };
//   pageInfo?: {
//     page: number;
//     rows: number;
//     search: string | null;
//     sorts: string | null;
//     totalPages: number;
//     totalRows: number;
//   };
//   [keys: string]: any;
// }

// export interface ResponseData {
//   code: string;
//   message: string;
//   status: number;
//   type: string;
//   instance: string;
//   data: any;
// }

export interface PageVo {
  page: number;
  rows: number;
  offset?: number;
  totalPages?: number;
  totalRows?: number;

  search?: SearchGroup;
  sorts?: SortVo[];
}

export interface SearchGroup {
  groupOp: string; // AND/OR
  rules: SearchRule[];
  groups?: SearchGroup[];
}

export interface SearchRule {
  column: string;
  op: string; // eq(equal), ct(contains)...
  keyword: string | number | boolean;
}

export interface LoginVo {
  userId: string;
  password: string;
}

export interface SortVo {
  column: string;
  order: "ASC" | "DESC";
}

export interface SelectorKeyVo {
  key: string;
  display: string;
  displayBracket?: string;
}

type StatusVo = { [key: number]: string };

export type OptionalValue = {
  // 커스텀 option value
  key: number;
  display: string;
  relationKey?: string; // 노출 여부 연결 key
};

export interface Column {
  key: string;
  name: string;
  type: string; // input, select ...(;구분자로 타입이 들어 올 수 있음)
  inputType?: string; // type: input(password, email...)
  data?: any;
  statusAr?: Array<StatusVo>;
  selectorDataList?: Array<any>; // type: select(항목)
  selectorKetSet?: SelectorKeyVo; // type: select(선택 값)
  size?: string; // 'full' === COL_SPAN 설정
  format?: string; // 포멧터(yyyy-MM-dd)
  placeholder?: string;
  value?: string | number | boolean;
  isRequired?: boolean; // 필수 체크
  optionalValue?: Array<OptionalValue>;
  minRows?: number; // textarea row 최소
  maxRow?: number; // textarea row 최대
  [key: string]: any;
}
export interface DataCardProps {
  init?: (
    column: Column[],
    data: any,
    title?: string,
    show?: boolean,
    gridCol?: number | unknown
  ) => void;
  getData?(): { [key: string]: any };
  getColumn?(name: string): Column | undefined;
  setColumnData?: (name: string, value: string) => void;
  handlerEvent?(value: string): void; // alias
  handlerDataChange?(data: Column[]): void; // data change
  validations?: Array<{}>; // input error text
  children?: React.ReactNode; // slot
}
