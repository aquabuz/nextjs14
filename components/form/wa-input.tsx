import { ChangeEvent, forwardRef, useState } from "react";
import { Input } from "@nextui-org/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export interface WaInputProps {
  id?: string;
  name?: string;
  label?: string;
  type?: "text" | "number" | "password" | "email";
  size?: "sm" | "md" | "lg";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  // classNames?: {
  //   [key: string]: any;
  // };
  required?: boolean;
  isInvalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  errorMessage?: string;
  onValueChange?: (value: string) => void;
  classNames?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  slot?: string; // slot
}

export const WaInput = forwardRef<HTMLInputElement, WaInputProps>(
  (
    {
      id,
      name,
      label,
      type,
      size,
      color,
      required,
      isInvalid,
      disabled,
      readOnly,
      errorMessage,
      onValueChange,
      classNames,
      placeholder,
      defaultValue,
      value,
      onChange,
      slot,
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    // const cn = {
    //   ...classNames,
    //   inputWrapper: [...((classNames && classNames.inputWrapper) || [])],
    // };

    return (
      <>
        <Input
          id={id}
          name={name}
          label={label}
          size={size}
          color={color}
          required={required}
          isInvalid={isInvalid}
          disabled={disabled}
          isReadOnly={readOnly}
          errorMessage={errorMessage}
          onValueChange={onValueChange}
          className={classNames}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          ref={ref}
          slot={slot}
          endContent={
            type === "password" && (
              <button
                className="absolute -translate-y-1/2 focus:outline-none top-1/2 right-4"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashIcon className="w-6 h-6" />
                ) : (
                  <EyeIcon className="w-6 h-6" />
                )}
              </button>
            )
          }
          type={isVisible ? "text" : type}
        />
      </>
    );
  }
);

WaInput.displayName = "WaInput";
