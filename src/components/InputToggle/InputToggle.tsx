import { useState } from "react";

import useOnPropChange from "@/hooks/useOnPropChange.ts";

export type InputToggleProps = {
  id: string;
  name: string;
  onToggle: () => void;
  isChecked?: boolean;
};

export default function InputToggle({
  id,
  name,
  onToggle,
  isChecked,
}: InputToggleProps) {
  const [checked, setChecked] = useState<boolean>(Boolean(isChecked));

  useOnPropChange(isChecked, (_, current) => {
    setChecked(Boolean(current));
  });

  const handleCheckboxChange = () => {
    setChecked((prevState) => !prevState);
    onToggle();
  };

  return (
    <div className="relative mr-2 inline-block h-auto w-10 align-middle transition duration-800 ease-in select-none">
      <input
        type="checkbox"
        className="input-toggle focus:outline-none dark:border-purple-400"
        id={id}
        name={name}
        checked={checked}
        onChange={handleCheckboxChange}
      />
      <label
        className="input-toggle-label block h-5 cursor-pointer overflow-hidden rounded-full bg-gray-400"
        htmlFor={id}
      />
    </div>
  );
}
