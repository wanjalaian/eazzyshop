import { CurrencyCode, formatPrice } from "./currencies";

export interface OrderItem {
  productTitle: string;
  variantTitle?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface WhatsAppOrderPayload {
  storeName: string;
  storePhone: string; // E.164 without + (e.g. "254712345678")
  orderRef: string;
  customer: {
    name: string;
    phone: string;
    deliveryLocation?: string;
    deliveryFee?: number;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee?: number;
  discountCode?: string;
  discountAmount?: number;
  totalAmount: number;
  currency: CurrencyCode;
}

export function formatWhatsAppMessage(order: WhatsAppOrderPayload): string {
  const fmt = (amount: number) => formatPrice(amount, order.currency);

  const itemLines = order.items.map((item, i) => {
    const variant = item.variantTitle ? ` (${item.variantTitle})` : "";
    return `${i + 1}. ${item.productTitle}${variant}\n   Qty: ${item.quantity} × ${fmt(item.unitPrice)} = ${fmt(item.total)}`;
  });

  const lines: string[] = [
    `🛍️ *NEW ORDER — ${order.storeName}*`,
    `Order Ref: #${order.orderRef}`,
    `──────────────────`,
    `👤 *Customer Details:*`,
    `• Name: ${order.customer.name}`,
    `• Phone: ${order.customer.phone}`,
  ];

  const deliveryFee = order.deliveryFee || order.customer.deliveryFee;

  if (order.customer.deliveryLocation) {
    const feeStr = deliveryFee
      ? ` (${fmt(deliveryFee)})`
      : "";
    lines.push(`• Delivery: ${order.customer.deliveryLocation}${feeStr}`);
  }

  lines.push(
    ``,
    `📦 *Items Ordered:*`,
    ...itemLines,
    ``,
    `──────────────────`,
    `• Subtotal: ${fmt(order.subtotal)}`,
  );

  if (order.discountCode && order.discountAmount && order.discountAmount > 0) {
    lines.push(`• Discount (${order.discountCode}): -${fmt(order.discountAmount)}`);
  }

  if (deliveryFee && deliveryFee > 0) {
    lines.push(`• Delivery Fee: ${fmt(deliveryFee)}`);
  }

  lines.push(`💰 *TOTAL: ${fmt(order.totalAmount)}*`);

  if (order.customer.notes) {
    lines.push(``, `📝 *Customer Note:* ${order.customer.notes}`);
  }

  return lines.join("\n");
}

export function buildWhatsAppUrl(order: WhatsAppOrderPayload): string {
  const cleanPhone = order.storePhone.replace(/[^0-9]/g, "");
  const message = formatWhatsAppMessage(order);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

export function normalizePhone(input: string, countryCode = "254"): string {
  let cleaned = input.replace(/[\s\-\(\)\.]/g, "");

  if (cleaned.startsWith("+")) {
    return cleaned.slice(1);
  }
  if (cleaned.startsWith("00")) {
    return cleaned.slice(2);
  }
  if (cleaned.startsWith("0")) {
    return `${countryCode}${cleaned.slice(1)}`;
  }
  return cleaned;
}
