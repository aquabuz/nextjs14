import React, { useState } from "react";

interface ToggleButtonProps {
  onLogin?: () => void;
  initialIsOn?: boolean;
}

const ToggleButton = ({ onLogin, initialIsOn }: ToggleButtonProps) => {
  const [isOn, setIsOn] = useState(initialIsOn);

  const toggle = () => {
    setIsOn((prevState) => !prevState);
    onLogin && onLogin();
  };

  return <button onClick={toggle}>{isOn ? "ON" : "OFF"}</button>;
};

export default ToggleButton;
