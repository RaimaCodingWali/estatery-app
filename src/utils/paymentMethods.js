export const DEFAULT_PAYMENT_METHODS = [
  {
    id: "pm_visa_4242",
    brand: "Visa",
    last4: "4242",
    expiry: "09/28",
    cardholderName: "Account Holder",
    isDefault: true,
  },
  {
    id: "pm_amex_1005",
    brand: "Amex",
    last4: "1005",
    expiry: "03/27",
    cardholderName: "Account Holder",
    isDefault: false,
  },
];

export function detectCardBrand(digits) {
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^4/.test(digits)) return "Visa";
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "Mastercard";
  if (/^6(?:011|5)/.test(digits)) return "Discover";
  return "Card";
}

export function formatCardNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function getCardDigits(formatted) {
  return formatted.replace(/\D/g, "");
}

export function isValidExpiry(expiry) {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const exp = new Date(year, month, 0, 23, 59, 59);
  return exp >= now;
}

export function isValidCardNumber(digits) {
  if (digits.length < 15 || digits.length > 16) return false;
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let n = Number(digits[i]);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

export function getCvvLength(brand) {
  return brand === "Amex" ? 4 : 3;
}

export function getBrandStyles(brand) {
  switch (brand) {
    case "Visa":
      return { gradient: "from-indigo-500 to-purple-600", label: null };
    case "Mastercard":
      return { gradient: "from-orange-500 to-red-600", label: "MC" };
    case "Amex":
      return { gradient: "from-slate-600 to-slate-800", label: "AMEX" };
    case "Discover":
      return { gradient: "from-amber-500 to-orange-600", label: "DISC" };
    default:
      return { gradient: "from-emerald-600 to-teal-700", label: "CARD" };
  }
}
