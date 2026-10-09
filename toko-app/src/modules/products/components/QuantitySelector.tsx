"use client";

import { useState } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";

export type QuantitySelectorProps = {
  stock: number;
  value?: number;
  onChange?: (val: number) => void;
};

export default function QuantitySelector({ stock, value, onChange }: QuantitySelectorProps) {
  const [internalQuantity, setInternalQuantity] = useState(1);
  
  const quantity = value !== undefined ? value : internalQuantity;
  
  const handleUpdate = (val: number) => {
    if (onChange) onChange(val);
    else setInternalQuantity(val);
  };

  const canDecrease = quantity > 1;
  const canIncrease = quantity < stock;

  return (
    <div className="mt-8 flex w-full items-center justify-between gap-4">
      <span className="text-sm font-semibold text-gray-900">Kuantitas</span>

      <div className="flex h-10 items-center rounded-md border border-gray-300">
        <button
          type="button"
          aria-label="Kurangi kuantitas"
          disabled={!canDecrease}
          onClick={() => handleUpdate(Math.max(1, quantity - 1))}
          className="flex h-full w-10 items-center justify-center border-r border-gray-300 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <LuMinus />
        </button>

        <span
          aria-live="polite"
          className="min-w-12 px-3 text-center text-sm font-medium text-gray-900"
        >
          {quantity}
        </span>

        <button
          type="button"
          aria-label="Tambah kuantitas"
          disabled={!canIncrease}
          onClick={() => handleUpdate(Math.min(stock, quantity + 1))}
          className="flex h-full w-10 items-center justify-center border-l border-gray-300 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <LuPlus />
        </button>
      </div>
    </div>
  );
}
