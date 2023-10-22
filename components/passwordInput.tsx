import React, { useState } from "react";
import { EyeOff } from "lucide-react";
import { Eye } from "lucide-react";
import { Button } from "./ui/button";

const PasswordInput = ({ password }: { password: string }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex">
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        disabled
        className="w-[60px] bg-transparent"
      />
      <Button
        variant={"outline"}
        className="border-0 shadow-none p-0 hover:bg-transparent"
        onClick={handleToggleVisibility}
      >
        {showPassword ? <Eye /> : <EyeOff />}
      </Button>
    </div>
  );
};

export default PasswordInput;
