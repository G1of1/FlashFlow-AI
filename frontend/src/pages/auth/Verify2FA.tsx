// pages/auth/Setup2FA.tsx

import { useState } from "react";
import QRCodeModal from "@/components/auth/QRModal";

const Verify2FA = () => {
    const [show2FAModal, setShow2FAModal] = useState(true);
  return (
    
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Set Up Two-Factor Authentication</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-center">
          Please complete your 2FA setup to continue using the app.
        </p>
        <QRCodeModal isOpen={show2FAModal} onClose={() => setShow2FAModal(false)} />
      </div>
    </div>
  );
};

export default Verify2FA;