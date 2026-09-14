import { Subscription } from "@prisma/client";

export type PaymentType = "FULL" | "INSTALLMENTS_2" | "INSTALLMENTS_3";

export type SubscriptionInstallment = {
  installmentNumber: number; // 1, 2, 3
  amount: number;
  dueDate: string; // YYYY-MM-DD
  paid: boolean;
  paidDate?: string | null; // YYYY-MM-DD
};

export type SubscriptionAlert = {
  subscriptionId: number;
  message: string;
  isUrgent: boolean;
  pendingInstallment?: SubscriptionInstallment;
  totalUnpaid: number;
};

export function getTodayDateString(): string {
  return new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
}

export function formatDateIT(dateStr?: string | null): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export function addMonths(dateStr: string, months: number): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const targetDate = new Date(year, month - 1 + months, day);
  const y = targetDate.getFullYear();
  const m = String(targetDate.getMonth() + 1).padStart(2, "0");
  const d = String(targetDate.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function calculateInstallments(
  totalPrice: number,
  paymentType: PaymentType,
  startDate?: string,
): { totalPaid: number; installments: SubscriptionInstallment[] } {
  const date = startDate || getTodayDateString();

  if (paymentType === "FULL") {
    return {
      totalPaid: totalPrice,
      installments: [
        {
          installmentNumber: 1,
          amount: totalPrice,
          dueDate: date,
          paid: true,
          paidDate: date,
        },
      ],
    };
  }

  if (paymentType === "INSTALLMENTS_2") {
    const r1 = Math.round(totalPrice / 2);
    const r2 = totalPrice - r1;
    const r2Date = addMonths(date, 1);

    return {
      totalPaid: r1,
      installments: [
        {
          installmentNumber: 1,
          amount: r1,
          dueDate: date,
          paid: true,
          paidDate: date,
        },
        {
          installmentNumber: 2,
          amount: r2,
          dueDate: r2Date,
          paid: false,
          paidDate: null,
        },
      ],
    };
  }

  if (paymentType === "INSTALLMENTS_3") {
    const r1 = Math.round(totalPrice / 3);
    const r2 = Math.round(totalPrice / 3);
    const r3 = totalPrice - (r1 + r2);
    const r2Date = addMonths(date, 1);
    const r3Date = addMonths(date, 2);

    return {
      totalPaid: r1,
      installments: [
        {
          installmentNumber: 1,
          amount: r1,
          dueDate: date,
          paid: true,
          paidDate: date,
        },
        {
          installmentNumber: 2,
          amount: r2,
          dueDate: r2Date,
          paid: false,
          paidDate: null,
        },
        {
          installmentNumber: 3,
          amount: r3,
          dueDate: r3Date,
          paid: false,
          paidDate: null,
        },
      ],
    };
  }

  return { totalPaid: totalPrice, installments: [] };
}

export function parseInstallments(
  installmentsData: any,
): SubscriptionInstallment[] {
  if (!installmentsData) return [];
  if (Array.isArray(installmentsData)) {
    return installmentsData as SubscriptionInstallment[];
  }
  if (typeof installmentsData === "string") {
    try {
      const parsed = JSON.parse(installmentsData);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function getSubscriptionPaymentAlert(
  sub: Subscription & { installments?: any },
  currentDate?: string,
): SubscriptionAlert | null {
  if (!sub) return null;
  const today = currentDate || getTodayDateString();

  // If fully paid, no alert
  if (sub.totalPaid >= sub.totalPrice) {
    return null;
  }

  // If advancePaymentDate is set and we haven't reached it yet, no alert yet
  if (sub.advancePaymentDate && today < sub.advancePaymentDate) {
    return null;
  }

  const unpaidAmount = sub.totalPrice - sub.totalPaid;
  const installments = parseInstallments(sub.installments);

  if (installments.length > 0) {
    const pending = installments.find((inst) => !inst.paid);
    if (pending) {
      const isUrgent = today > pending.dueDate;
      const totalCount = installments.length;

      let message = "";
      if (totalCount === 2) {
        if (isUrgent) {
          message = `Abbonamento #${sub.id}: 2ª rata scaduta il ${formatDateIT(pending.dueDate)} (€${pending.amount})`;
        } else {
          message = `Abbonamento #${sub.id}: deve saldare la 2ª rata (saldo finale di €${pending.amount})`;
        }
      } else if (totalCount === 3) {
        if (pending.installmentNumber === 2) {
          if (isUrgent) {
            message = `Abbonamento #${sub.id}: 2ª rata di 3 scaduta il ${formatDateIT(pending.dueDate)} (€${pending.amount})`;
          } else {
            message = `Abbonamento #${sub.id}: deve saldare la 2ª rata di 3 (€${pending.amount})`;
          }
        } else {
          if (isUrgent) {
            message = `Abbonamento #${sub.id}: ultima rata (3ª di 3) scaduta il ${formatDateIT(pending.dueDate)} (€${pending.amount})`;
          } else {
            message = `Abbonamento #${sub.id}: deve saldare l'ultima rata (3ª di 3, €${pending.amount})`;
          }
        }
      } else {
        if (isUrgent) {
          message = `Abbonamento #${sub.id}: rata ${pending.installmentNumber} scaduta il ${formatDateIT(pending.dueDate)} (€${pending.amount})`;
        } else {
          message = `Abbonamento #${sub.id}: deve saldare la rata ${pending.installmentNumber} (€${pending.amount})`;
        }
      }

      return {
        subscriptionId: sub.id,
        message,
        isUrgent,
        pendingInstallment: pending,
        totalUnpaid: unpaidAmount,
      };
    }
  }

  // Fallback for subscriptions without structured installments
  return {
    subscriptionId: sub.id,
    message: `Abbonamento #${sub.id}: deve saldare il residuo di €${unpaidAmount}`,
    isUrgent: false,
    totalUnpaid: unpaidAmount,
  };
}

export function getUserPaymentAlerts(
  subscriptions?: (Subscription & { installments?: any })[],
  currentDate?: string,
): SubscriptionAlert[] {
  if (!subscriptions || subscriptions.length === 0) return [];
  const alerts: SubscriptionAlert[] = [];

  for (const sub of subscriptions) {
    const alert = getSubscriptionPaymentAlert(sub, currentDate);
    if (alert) {
      alerts.push(alert);
    }
  }

  return alerts;
}
