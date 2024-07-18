import { useInterval } from "usehooks-ts";

interface Props {
  message: string;
  setIsToast: React.Dispatch<React.SetStateAction<boolean>>;
  position?: "top" | "bottom";
  bgColor?: "blue" | "red" | string;
}

export default function ToastPopup({
  message,
  setIsToast,
  position,
  bgColor,
}: Props) {
  useInterval(() => {
    setIsToast(false);
  }, 3000);

  return (
    <div
      className={`px-10 py-4 left-1/2 transform -translate-x-1/2 fixed z-30 flex max-w-sm text-sm items-center justify-center rounded-[5px] shadow-md ${
        position === "top"
          ? `animate-toast-top top-10`
          : `animate-toast-bottom bottom-10`
      }
      ${
        bgColor === "blue"
          ? "bg-blue-800"
          : bgColor === "red"
          ? "bg-danger-200"
          : "bg-gray-700"
      }
      `}
    >
      <p className="text-white text-Body">{message}</p>
    </div>
  );
}
