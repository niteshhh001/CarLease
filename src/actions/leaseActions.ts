"use server";

import { paymentAlertSuggestions, type PaymentAlertSuggestionsInput, type PaymentAlertSuggestionsOutput } from "@/ai/flows/payment-alert-suggestions";

export async function getAIPaymentAlertSuggestion(
  input: PaymentAlertSuggestionsInput
): Promise<PaymentAlertSuggestionsOutput> {
  try {
    const result = await paymentAlertSuggestions(input);
    return result;
  } catch (error) {
    console.error("Error getting AI payment alert suggestion:", error);
    // Provide a default or error response structure
    return {
      shouldSendReminder: false,
      reminderReason: "Error: Could not retrieve AI suggestion at this time.",
    };
  }
}
