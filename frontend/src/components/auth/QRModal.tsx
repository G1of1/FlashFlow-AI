import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

type QRCodeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const QRCodeModal = ({ isOpen, onClose }: QRCodeModalProps) => {
  const [qrCode, setQrCode] = useState<string>("");
  const [token, setToken] = useState("");
  const { toast } = useToast();
  const query = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQr = async () => {
      try {
        const res = await fetch("/api/auth/2fa/generate", { method: "POST" });
        const data = await res.json();
        if (res.ok && data.success) {
          setQrCode(data.data);
        } 
        else {
          toast({
            title: "Error",
            description: data.error || "Failed to generate QR code",
            variant: "destructive",
          });
        }
      } 
      catch (error : any) {
        toast({
          title: "Error",
          description: `${error}`,
          variant: "destructive",
        });
      }
    };

    if (isOpen) {
      setQrCode(""); // Reset
      setToken("");
      fetchQr();
    }
  }, [isOpen]);

  const handleVerify = async () => {
    const res = await fetch("/api/auth/2fa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      toast({ title: "2FA Verified", description: data.message });
      onClose();
      await query.invalidateQueries({queryKey: ['authUser']})
      await navigate("/")
      
    } else {
      toast({
        title: "Verification Failed",
        description: data.error || "Invalid code",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Set Up Two-Factor Authentication - <strong>Required</strong></DialogTitle>
          <DialogDescription>
            Scan the QR code with Google Authenticator or Authy, then enter the 6-digit code below.<br></br>  
             <strong>You will not be able to using FlashFlow AI without seting up 2FA.</strong>
          </DialogDescription>
        </DialogHeader>

        {qrCode ? (
          <img src={qrCode} alt="2FA QR Code" className="mx-auto w-48 h-48 my-4" />
        ) : (
          <p className="text-center my-6 text-sm">Loading QR code...</p>
        )}

        <Input
          type="text"
          placeholder="Enter 6-digit code"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="mt-4"
        />

        <Button
          onClick={handleVerify}
          className="w-full bg-orange-500 hover:bg-orange-600 mt-4"
        >
          Verify
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;