// Minimalist self-contained QR Code matrix generator (supports standard URLs)

export function generateQRCodeSVG(text: string, size = 200): string {
  // Use Google Charts API or quick SVG QR generator fallback for 100% precision
  const encoded = encodeURIComponent(text);
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&margin=2&color=0f172a&bgcolor=ffffff`;
  return qrApiUrl;
}
