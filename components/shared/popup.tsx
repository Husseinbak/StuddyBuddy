import { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface PopupProps {
  children: ReactNode;
  openPopup: boolean;
  setOpenPopup: Dispatch<SetStateAction<boolean>>;
  cancel?: boolean;
  title?: string;
}

const PopUp = ({
  children,
  openPopup,
  setOpenPopup,
  cancel,
  title,
}: PopupProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setOpenPopup(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && e.target === overlayRef.current) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {openPopup && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 bg-transparent bg-opacity-40 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 relative"
          >
            {cancel && (
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                <X size={20} />
              </button>
            )}

            {title && (
              <h2 className="text-xl font-semibold mb-4 text-left">{title}</h2>
            )}

            <div className="overflow-y-auto scrollbar-hide mt-3 px-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopUp;
