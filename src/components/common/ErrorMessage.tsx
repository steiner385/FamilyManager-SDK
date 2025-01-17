import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center p-4 text-red-500">
      <span className="text-sm">{message}</span>
    </div>
  );
}
