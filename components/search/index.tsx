import { ReactNode, useCallback, useEffect, useState } from "react";
import { Button, Select, SelectItem, Tooltip } from "@nextui-org/react";
import { SearchRule } from "@/service/network/types";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { WaInput } from "../form/wa-input";

interface Columns {
  [key: string]: string | boolean;
}

export interface SearchFormData {
  columns: Columns[];
  keyword: string;
}

interface Props {
  title: string;
  searchFormData: SearchFormData;
  children?: ReactNode;
  onFormSubmit: ({ searchList }: any) => void;
}

const SEARCH = {
  column: "",
  op: "ct",
  keyword: "",
};

const SearchUI: React.FC<Props> = ({
  title,
  searchFormData,
  onFormSubmit,
  children,
}) => {
  const [init, setInit] = useState<boolean>(true); // 초기 진입 셀렉트박스 값, 검색 후 디폴트로 변경 방지
  const [requestSearch, setRequestSearch] = useState<SearchRule>(SEARCH);
  const [searchFormList, setSearchFormList] = useState<Columns[] | null>(null);

  const handleSubmit = useCallback(
    (event: { preventDefault: () => void }) => {
      event.preventDefault();
      if (!requestSearch.keyword || requestSearch.keyword === "") {
        return alert("검색어를 입력해주세요.");
      }
      if (!requestSearch.column || requestSearch.column === "") {
        return alert("카테고리를 선택 해주세요.");
      }
      onFormSubmit({
        ...requestSearch,
      });
    },
    [onFormSubmit, requestSearch]
  );

  const handleChange = (field: string, value: string) => {
    setRequestSearch({ ...requestSearch, [field]: value });
  };

  /**
   * @param {searchFormList}
   * @key default === true
   * @description
   * 검색 셀렉트박스 고정값
   * 초기 페이지 진입 시에만 실행 되어야 함. 검색 후 셀렉트박스가 변경 됨.
   *
   * TODO:: disabled 키 추가해야 함 초기화 기능
   * ex: disabledKeys={col.disabledKeys}
   */
  useEffect(() => {
    if (!init) return;
    searchFormList?.forEach((searchForm) => {
      searchForm.default &&
        setRequestSearch((prevState) => ({
          ...prevState,
          column: Object.keys(searchForm)[0],
        })),
        setInit(false);
    });
  }, [init, searchFormList]);

  useEffect(() => {
    setSearchFormList([...searchFormData.columns]);
  }, [searchFormData]);

  const handlerInit = () => {
    // 아래 코드 인풋만 초기화 됨
    // 셀렉트도 초기화 해야 함
    setRequestSearch(SEARCH);
    onFormSubmit(null);
  };
  // disabled 키 추가해야 함 초기화 기능
  // selected value > computed
  // const watchSelectedData = useCallback((col: any) => {
  //   if (!col.data) return ["disabled"];
  //   return [col.data];
  // }, []);

  return (
    <form className="flex gap-8 px-5 py-2 my-4 rounded" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2 font-size-5">
        <MagnifyingGlassIcon width={20} height={20} className="text-gray-300" />
        <h3 className="text-xl">{title}</h3>
      </div>
      <div className="flex items-center flex-1 gap-1">
        <div className="flex items-center gap-1 w-2/3">
          {searchFormList && (
            <Select
              label="선택"
              size="sm"
              className="basis-1/3"
              selectedKeys={requestSearch.column ? [requestSearch.column] : []}
              onChange={(e) => handleChange("column", e.target.value)}
            >
              {searchFormList.map((formData) => (
                <SelectItem
                  key={Object.keys(formData)[0]}
                  value={Object.keys(formData)[0]}
                >
                  {Object.values(formData)[0]}
                </SelectItem>
              ))}
            </Select>
          )}
          <WaInput
            label="검색어"
            type="text"
            size="sm"
            classNames="basis-2/3"
            value={String(requestSearch.keyword)}
            onChange={(e) => handleChange("keyword", e.target.value)}
          />
          <Tooltip
            content="선택 및 검색어를 입력 해주세요!"
            size="sm"
            color="primary"
          >
            <Button color="primary" className="text-white" type="submit">
              검색
            </Button>
          </Tooltip>
          <Button
            color="secondary"
            className="text-white"
            onClick={handlerInit}
          >
            초기화
          </Button>
        </div>
        {children}
      </div>
    </form>
  );
};

export default SearchUI;
