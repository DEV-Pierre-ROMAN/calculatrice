"use client";

import React, { useEffect, useRef } from "react";

export type TouchProps = {
  value: string;
  children?: React.ReactNode;
  callback: (value: string) => void;
};

export const Touch = ({ value, children, callback }: TouchProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === value) {
        console.log(e.key);
        buttonRef.current?.click();
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [value]);

  return (
    <button
      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
      ref={buttonRef}
      onClick={() => callback(value)}
    >
      {children || value}
    </button>
  );
};
