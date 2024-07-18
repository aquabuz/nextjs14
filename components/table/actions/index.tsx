"use client";

import { Tooltip } from "@nextui-org/react";
import {
  CreditCardIcon,
  InboxArrowDownIcon,
} from "@heroicons/react/24/outline";
import { FileInfo } from "@/service/network/types/fileInfo";

interface ActionsButtonsProps {
  data: FileInfo;
  actions: string[];
  handlerActions: (action: string, data: FileInfo) => void;
}

const ActionsButtons = ({
  data,
  actions,
  handlerActions,
}: ActionsButtonsProps) => {
  return (
    <div className="relative flex items-center gap-2">
      {actions.map((action, index) => (
        <Tooltip content={action} key={index}>
          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
            <button
              className="flex items-center"
              onClick={() => handlerActions(action, data)}
            >
              {action === "download" ? (
                <InboxArrowDownIcon width={20} height={20} />
              ) : (
                <CreditCardIcon width={20} height={20} />
              )}
            </button>
          </span>
        </Tooltip>
      ))}
    </div>
  );
};

ActionsButtons.displayName = "ActionsButtons";

export default ActionsButtons;
