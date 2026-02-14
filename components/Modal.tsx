'use client';

import { useEffect } from 'react';

interface ModalProps {
      isOpen: boolean;
      onClose: () => void;
      title: string;
      children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
      useEffect(() => {
            if (isOpen) {
                  document.body.style.overflow = 'hidden';
            } else {
                  document.body.style.overflow = 'auto';
            }
            return () => {
                  document.body.style.overflow = 'auto';
            };
      }, [isOpen]);

      if (!isOpen) return null;

      return (
            <div
                  className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
                  onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                              onClose();
                        }
                  }}
            >
                  <div
                        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onMouseDown={(event) => event.stopPropagation()}
                  >
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                              <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                                    aria-label="Close"
                              >
                                    ×
                              </button>
                        </div>
                        <div className="p-6">{children}</div>
                  </div>
            </div>
      );
}
