import { FC } from "react";

export const BaseLoader: FC = () => {
  return (
    <div
      data-testid="generic-loader"
      className="flex items-center justify-center my-8"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-900" />
    </div>
  );
};

export const DialogLoader: FC = () => {
  return (
    <div
      data-testid="dialog-loader"
      className="absolute inset-0 z-[9] flex items-center justify-center "
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-900" />
    </div>
  );
};
