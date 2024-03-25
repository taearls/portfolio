import { useState, useEffect } from "react";

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

  useEffect(() => {
    setChecked(Boolean(isChecked));
  }, [isChecked]);

  return (
    <div className="duration-800 relative mr-2 inline-block h-auto w-10 select-none align-middle transition ease-in">
      <input
        type="checkbox"
        className="input-toggle focus:outline-none dark:border-purple-400"
        id={id}
        name={name}
        checked={checked}
        onChange={() => {
          setChecked((prevState) => !prevState);
          onToggle();
        }}
      />
      <label
        className="input-toggle-label block h-5 cursor-pointer overflow-hidden rounded-full bg-gray-400"
        htmlFor={id}
      />
    </div>
  );
}
