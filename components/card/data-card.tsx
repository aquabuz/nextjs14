import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import Link from "next/link";
import { regexPhoneNumber } from "@/utils/converter";
import dateFormat from "@/utils/dateFormat";
import { Column, DataCardProps, OptionalValue } from "@/service/network/types";
import { WaInput, WaInputProps } from "@/components/form/wa-input";
import { RealStatus } from "@/components/status/real-status";
// import { GRID_COLS, COL_SPAN } from "@/data/tailwind/class"; // 외부 파일 작동 X

const GRID_COLS = [
  "lg:grid-cols-1",
  "lg:grid-cols-2",
  "lg:grid-cols-3",
  "lg:grid-cols-4",
  "lg:grid-cols-5",
  "lg:grid-cols-6",
  "lg:grid-cols-7",
  "lg:grid-cols-8",
  "lg:grid-cols-9",
];

const COL_SPAN = [
  "lg:col-span-1",
  "lg:col-span-2",
  "lg:col-span-3",
  "lg:col-span-4",
  "lg:col-span-5",
  "lg:col-span-6",
  "lg:col-span-7",
  "lg:col-span-8",
  "lg:col-span-9",
];

type InputType = WaInputProps["type"];

const DataCard = forwardRef((props: DataCardProps, ref) => {
  // children 속성 중 slot 활용 위치 조정
  const slots = React.Children.toArray(props.children).reduce(
    (acc: any, child) => {
      if (React.isValidElement(child) && child.props.slot) {
        acc[child.props.slot] = child;
      }
      return acc;
    },
    {}
  );

  const [columns, setColumns] = useState<Column[]>([]);
  const [itemTitle, setItemTitle] = useState<string | undefined>("");
  const [isShow, setShow] = useState<boolean>(false);
  const [gridColumns, setGridColumns] = useState<number | undefined>(0);
  const originRef = useRef<any>(null);

  const init = ({
    column,
    data,
    title,
    show,
    gridCol,
  }: {
    column: Array<Column>;
    data: any;
    title?: string;
    show?: boolean;
    gridCol?: number;
  }) => {
    originRef.current = data ? data : makeDefaultOrigin(column);
    setColumns(data ? matchingData(column, data) : matchingData(column, []));
    title && setItemTitle(title);
    setShow(show ? show : false);
    setGridColumns(gridCol || 5);
    // isShow.value = show && !!columns.value ? true : false;
    // console.log("init 🌟", data);
  };

  const makeDefaultOrigin = <T extends { key: string }>(column: T[]) => {
    const _obj: { [key: string]: string } = {};
    for (let i = 0; i < column.length; i++) {
      let originKey = column[i].key;
      _obj[originKey] = "";
    }
    return _obj;
  };

  /**
   * @param column 필요항목
   * @param data null | 실제 데이터
   */
  const matchingData = (column: any, data: any) => {
    for (let i = 0; i < column.length; i++) {
      // statusAr options
      if (column[i].statusAr) {
        for (let j = 0; j < column[i].statusAr.length; j++) {
          let key = Object.keys(column[i].statusAr[j]);
          let value = Object.values(column[i].statusAr[j]);
          if (key[0] == data[column[i].key]) {
            column[i].data = value[0];
            break;
          }
        }
      } else if (column[i].type === "select") {
        const key = column[i].selectorKetSet.key;
        const display = column[i].selectorKetSet.display;
        const displayBracket = column[i].selectorKetSet.displayBracket || ""; // (id)

        let _arr = [];

        for (let j = 0; j < column[i].selectorDataList.length; j++) {
          const _data = column[i].selectorDataList[j];
          _arr.push({
            key: _data[key],
            display: displayBracket
              ? `${_data[display]} (${_data[displayBracket]})`
              : _data[display],
            gameStatus:
              display === "game_name" ? String(_data.real_status) : "", // 게임 상태
          });
        }

        /**
         * @deprecated 추후 사용 가능성
         * @name optionalInputs
         */
        if (column[i].optionalValue?.length > 0) {
          _arr.unshift(...column[i].optionalValue);
        }

        // default selectItem
        _arr.unshift({
          key: "disabled",
          display: "선택해주세요",
        });

        column[i].options = _arr;

        /**
         * @title 비활성 목록 추가
         * @param {disabledKeys}
         * @description
         * @deprecate selectItem isDisabled X (지원 종료)
         * disabledKeys 목록 O
         */
        if (column[i].disabledKeys?.length > 0) {
          column[i].disabledKeys = ["disabled", ...column[i].disabledKeys];
        } else {
          column[i].disabledKeys = ["disabled"];
        }

        column[i].data =
          data[column[i].key] !== undefined ? String(data[column[i].key]) : "";
      } else if (column[i].type === "date") {
        column[i].data = data[column[i].key]
          ? dateFormat.parser(data[column[i].key] || "", column[i].format)
          : "";
      } else if (column[i].key === "mem_hp") {
        column[i].data = regexPhoneNumber(data[column[i].key]);
      } else if (column[i].value) {
        // default value 가 필요할 때
        if (!column[i].data) {
          column[i].data = column[i].value;
        }
      } else if (column[i].isInvalid) {
        // TODO:: 유효성
        column[i].isInvalid = column[i].isInvalid;
      } else {
        column[i].data =
          data[column[i].key] !== undefined ? String(data[column[i].key]) : "";
      }
    }
    return column;
  };

  const getData = () => {
    for (let i = 0; i < columns.length; i++) {
      let key = columns[i].key;
      let value = columns[i].data;
      // date 제외
      if (columns[i].type === "date") {
        continue;
      }
      // select options 제외
      if (columns[i].statusAr) {
        continue;
      }

      (originRef.current as any)[key] = value;
    }
    return originRef.current;
  };

  const getColumn = (value: string) => {
    // ex: storeRoomRef.current.getColumn!("app_idx")
    return columns.find((column) => column.key === value);
  };

  const getColumnName = (name: string) => {
    for (let i = 0; i < columns.length; i++) {
      let key = columns[i].key;
      if (key === name) {
        return columns[i];
      }
    }
    return null;
  };

  /**
   * 특정 컬럼 값 변경시
   * @param name 컬럼명
   * @param value 값
   */
  const setColumnData = (name: string, value: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((item) =>
        item.key === name ? { ...item, data: value } : item
      )
    );
  };

  // selected value > computed
  const watchSelectedData = useCallback((col: any) => {
    if (!col.data) return ["disabled"];
    return [col.data];
  }, []);

  /**
   * @deprecated 추후 사용 가능성
   * @name optionalInputs
   * @description
   * 사용자 정의 옵션 > optionalValue > relationKey 배열 리턴
   * optionalInputs.includes(col.key) 포함 key = 노출 X
   */
  const [optionalInputs, setOptionalInputs] = useState<string[]>([]);

  /**
   * @deprecated 추후 사용 가능성
   * @function handlerOptionalInputs
   * @param {columns}
   * @description useEffect {columns}
   */
  const handlerOptionalInputs = useCallback(() => {
    columns.find((column: Column) => {
      column.optionalValue?.forEach((obj: OptionalValue) => {
        const newOption = obj.relationKey;
        if (!newOption) return;
        setOptionalInputs((prevOption) => {
          return column.key === "game_idx" && column.data === "0"
            ? prevOption.filter((option) => option !== newOption)
            : [...prevOption, newOption];
        });
      });
    });
  }, [columns]);

  /**
   * @deprecated 추후 사용 가능성
   * @function handlerOptionalColumn
   * @param {optionalInputs}
   * @description useEffect {optionalInputs}
   * 옵션 선택 시 데이터 리셋
   */
  const handlerOptionalColumn = useCallback(() => {
    columns.filter((column) => {
      if (optionalInputs.includes(column.key)) {
        column.data = "";
      }
    });
  }, [columns, optionalInputs]);

  /**
   * @todo WARN: A component changed from uncontrolled to controlled.
   * @property {defaultSelectedKeys} => 쓸모 X
   * @property {selectedKeys} => 리렌더링 data 매칭 O, 하지만 경고 메세지
   */
  const handlerChange = useCallback(
    (target: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      const { name, value, ...rest } = target.target;
      setColumns((prevColumns) =>
        prevColumns.map((item) =>
          item.key === name ? { ...item, data: value || "" } : item
        )
      );
    },
    []
  );

  useEffect(() => {
    handlerOptionalInputs();
  }, [columns, handlerOptionalInputs]);

  useEffect(() => {
    handlerOptionalColumn();
  }, [optionalInputs, handlerOptionalColumn]);

  useImperativeHandle(ref, () => ({
    init: (
      column: Array<Column>,
      data: any,
      title?: string,
      show?: boolean,
      gridCol?: number
    ) => init({ column, data, title, show, gridCol }),
    getData: () => getData(),
    getColumn: (name: string) => getColumn(name),
    setColumnData: (name: string, value: string) => setColumnData(name, value),
  }));

  const getInputType = (input: InputType | undefined): InputType => {
    const isValidInputType = (input: unknown): input is InputType =>
      typeof input === "string" &&
      ["text", "number", "password", "email"].includes(input);

    return input && isValidInputType(input) ? input : "text";
  };

  const renderGridLayout = () => {
    // tailwind 특성 상 템플릿 리터럴 권장 X
    if (!gridColumns) return;
    return GRID_COLS[gridColumns - 1];
  };

  const renderCard = (size: string | undefined) => {
    // tailwind 특성 상 템플릿 리터럴 권장 X
    if (size === "full") {
      if (!gridColumns) return;
      return COL_SPAN[gridColumns - 1];
    }
  };

  // 유효성 검사 에러 메세지
  useLayoutEffect(() => {
    if (props.validations) {
      const updatedColumns = columns.map((col) => ({
        ...col,
        errorMessage: (
          props.validations?.find(
            (obj: { [key: string]: string }) => obj[col.key]
          ) as { [key: string]: string }
        )?.[col.key],
      }));
      if (JSON.stringify(updatedColumns) !== JSON.stringify(columns)) {
        setColumns(updatedColumns);
      }
    }
  }, [columns, props.validations]);

  // 데이터 변경 부모에 알림
  useLayoutEffect(() => {
    if (props.handlerDataChange) {
      props.handlerDataChange!(columns);
    }
  }, [columns, props.handlerDataChange]);

  return (
    <>
      {itemTitle && (
        <>
          <div className="py-4 flex items-center">
            <h2 className="shrink-0 text-xl text-gray-400">{itemTitle}</h2>
            {slots.topButton}
          </div>
          <Divider />
        </>
      )}
      <div
        className={`grid grid-cols-1 gap-2 py-8 md:grid-cols-2 ${renderGridLayout()}`}
      >
        {columns.map(
          (col, index) =>
            !optionalInputs.includes(col.key) && (
              <Card key={index} className={`py-1 ${renderCard(col.size)}`}>
                {col.name.includes(";") ? (
                  <>
                    <CardHeader>
                      <p className="text-zinc-400">{col.name.split(";")[0]}</p>
                    </CardHeader>
                    <CardBody>
                      <div className="flex gap-1 items-center">
                        {col.type.split(";").map((type, idx) => (
                          <React.Fragment key={idx}>
                            {type === "input" && (
                              <WaInput
                                type="text"
                                name={col.key}
                                value={col.data}
                                placeholder={col.placeholder}
                                errorMessage={col.errorMessage}
                                isInvalid={col?.isInvalid}
                                readOnly={col?.readOnly}
                                disabled={col?.disabled}
                                onChange={handlerChange}
                              />
                            )}
                            {type === "button" && (
                              <Button
                                onClick={() => props.handlerEvent!(col.data)}
                              >
                                {col.name.split(";")[idx]}
                              </Button>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </CardBody>
                  </>
                ) : (
                  <>
                    <CardHeader>
                      <p className="text-zinc-400">{col.name}</p>
                    </CardHeader>
                    <CardBody>
                      {col.type === "input" ? (
                        <WaInput
                          type={getInputType(col?.inputType as InputType)}
                          name={col.key}
                          value={col.data}
                          placeholder={col.placeholder}
                          errorMessage={col.errorMessage}
                          isInvalid={col?.isInvalid}
                          readOnly={col?.readOnly}
                          disabled={col?.disabled}
                          onChange={handlerChange}
                        />
                      ) : col.type === "select" ? (
                        <Select
                          isRequired={col.isRequired}
                          label="선택"
                          size="md"
                          name={col.key}
                          selectedKeys={watchSelectedData(col)}
                          disabledKeys={col.disabledKeys}
                          errorMessage={col.errorMessage}
                          onChange={handlerChange}
                        >
                          {col.options.map(
                            ({
                              key,
                              display,
                              gameStatus,
                            }: {
                              key: string;
                              display: string;
                              gameStatus: string | null;
                            }) => (
                              <SelectItem
                                key={key}
                                startContent={
                                  gameStatus ? (
                                    <RealStatus
                                      value={Number(gameStatus)}
                                      noText={true}
                                      variant="dot"
                                    />
                                  ) : null
                                }
                              >
                                {display}
                              </SelectItem>
                            )
                          )}
                        </Select>
                      ) : col.type === "link" ? (
                        <Link href={col.data} target="_blink">
                          {col.data}
                        </Link>
                      ) : col.type === "textarea" ? (
                        <Textarea
                          name={col.key}
                          value={col.data}
                          minRows={col.minRows ? col.minRows : 8}
                          maxRows={col.maxRow ? col.maxRow : 8}
                          onChange={handlerChange}
                        />
                      ) : (
                        <p className="lg:min-h-[56px] items-center flex">
                          {col.data}
                        </p>
                      )}
                    </CardBody>
                  </>
                )}
              </Card>
            )
        )}
      </div>
    </>
  );
});

DataCard.displayName = "DataCard";

export default DataCard;
