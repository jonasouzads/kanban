// components/modals/WebhookModal.tsx
"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  webhookToken: string;
}

const WebhookModal = ({ isOpen, onClose, boardId, webhookToken }: WebhookModalProps) => {
  const [copied, setCopied] = useState(false);

  // Certifique-se de que webhookToken está correto
  console.log("Webhook Token:", webhookToken);

  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/wizebot/${webhookToken}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Webhook URL</DialogTitle>
          <DialogDescription>
            Use esta URL para configurar o webhook na plataforma.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">URL do Webhook</label>
            <div className="flex gap-2 items-center">
              <Input
                readOnly
                value={webhookUrl}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
              {copied && <span className="text-green-500 ml-2">Copiado!</span>}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Como usar:</h4>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal pl-4">
              <li>Copie a URL do webhook acima</li>
              <li>Configure na plataforma de origem</li>
              <li>Envie os campos: <code>name</code>, <code>phone</code> e <code>chat_id</code></li>
            </ol>
          </div>

          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm font-medium">⚠️ Importante:</p>
            <p className="text-sm text-muted-foreground mt-1">
              Mantenha esta URL segura. Qualquer pessoa com acesso a ela poderá enviar leads para este board.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WebhookModal;
