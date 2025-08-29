import { forwardRef } from "react";

const TextInput = forwardRef(({ label, type, error, ...props }, ref) => {
  return (
    <div className="mb-4 flex-col">
      <div>
        <label className="font-bold">{label} : </label>
      </div>
      <div>
        <input
          ref={ref}
          type={type}
          className="border-black border-2"
          {...props}
        />
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
});

// Add displayName for forwardRef
TextInput.displayName = "TextInput";

export default TextInput;
