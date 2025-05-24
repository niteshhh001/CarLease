"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Lessee, Payment } from "@/lib/types";
import { MONTHLY_LEASE_AMOUNT } from "@/lib/constants";
import { getAIPaymentAlertSuggestion } from "@/actions/leaseActions";
import type { PaymentAlertSuggestionsOutput } from "@/ai/flows/payment-alert-suggestions";
import { Lightbulb, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


interface AIReminderDialogProps {
  lessee: Lessee | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AIReminderDialog({ lessee, isOpen, onClose }: AIReminderDialogProps) {
  const [suggestion, setSuggestion] = useState<PaymentAlertSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    if (!lessee) return;
    setIsLoading(true);
    setSuggestion(null);

    const paymentHistoryForAI = lessee.paymentHistory.map(p => ({
        date: new Date(p.date).toLocaleDateString('en-CA'), // YYYY-MM-DD format often works well
        amount: p.amount,
        status: p.status,
    }));

    try {
      const result = await getAIPaymentAlertSuggestion({
        lesseeName: lessee.name,
        vehicleId: lessee.vehicleId || "N/A",
        paymentHistory: paymentHistoryForAI,
        expectedMonthlyPayment: MONTHLY_LEASE_AMOUNT,
      });
      setSuggestion(result);
    } catch (error) {
      console.error("AI Suggestion Error:", error);
      toast({
        title: "Error",
        description: "Failed to get AI suggestion. Please try again.",
        variant: "destructive",
      });
      setSuggestion({
        shouldSendReminder: false,
        reminderReason: "Error retrieving suggestion."
      })
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state when dialog opens with a new lessee or simply opens
  useState(() => {
    if (isOpen) {
      setSuggestion(null);
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, lessee]);


  if (!lessee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { setSuggestion(null); setIsLoading(false); } onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            AI Payment Reminder Suggestion
          </DialogTitle>
          <DialogDescription>
            Get an AI-powered suggestion on whether to send a payment reminder to {lessee.name}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {!suggestion && !isLoading && (
            <Button onClick={handleGetSuggestion} className="w-full">
              Get Suggestion
            </Button>
          )}

          {isLoading && (
            <div className="flex justify-center items-center h-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Analyzing payment history...</p>
            </div>
          )}

          {suggestion && !isLoading && (
            <Alert variant={suggestion.shouldSendReminder ? "destructive" : "default"} className="mt-4 animate-fadeIn">
               {suggestion.shouldSendReminder ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              <AlertTitle>
                {suggestion.shouldSendReminder
                  ? "Reminder Recommended"
                  : "Reminder Not Necessary (Yet)"}
              </AlertTitle>
              <AlertDescription>{suggestion.reminderReason}</AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => { setSuggestion(null); setIsLoading(false); onClose();}}>
            Close
          </Button>
          {suggestion && (
             <Button onClick={handleGetSuggestion} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Re-analyze
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
