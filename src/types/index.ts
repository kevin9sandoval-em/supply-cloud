export type Currency = 'MXN' | 'USD' | 'EUR';

export interface CurrencyRate {
  code: Currency;
  name: string;
  symbol: string;
  rateToMxn: number; // Factor de conversión a Moneda Nacional (MXN)
}

export interface Organization {
  id: string;
  name: string;
  legalName: string;
  taxId: string; // RFC o NIT
  industry: string;
  city: string;
  logoUrl?: string;
  baseCurrency: Currency;
  deliveryAddress: string;
}

export interface Category {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  productCount: number;
}

export interface Product {
  id: string;
  organizationId: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  unit: string; // 'Pza', 'Kg', 'Metro', 'Litro', 'Caja', 'Juego'
  photoUrl: string;
  referencePriceMxn: number; // Precio histórico o de referencia en MXN
  technicalSpecs?: string;
  minStock?: number;
}

export interface Supplier {
  id: string;
  name: string;
  companyName: string;
  contactEmail: string;
  phone: string;
  taxId: string; // RFC o NIT
  rating: number; // 1-5 estrellas
  category: string;
  isVerified: boolean;
}

export interface RFQItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  photoUrl: string;
  unit: string;
  quantity: number;
  specNotes?: string;
  referencePriceMxn: number;
}

export type RFQStatus = 'open' | 'evaluating' | 'awarded' | 'closed';

export interface RFQ {
  id: string;
  organizationId: string;
  organizationName: string;
  organizationTaxId: string;
  deliveryAddress: string;
  code: string; // ej. RFQ-2026-0104
  title: string;
  department: string; // ej. Mantenimiento, Producción, Planta 2
  description: string;
  status: RFQStatus;
  deadline: string; // ISO date
  baseCurrency: Currency; // Moneda Nacional para el cuadro comparativo (por defecto MXN)
  items: RFQItem[];
  invitedSupplierIds: string[];
  awardedSupplierId?: string;
  awardedQuotationId?: string;
  createdAt: string;
}

export interface QuotationItemBid {
  productId: string;
  unitPrice: number; // en la moneda ofertada
  leadTimeDays: number; // Días de entrega
  brandOrModel?: string;
  notes?: string;
}

export interface Quotation {
  id: string;
  rfqId: string;
  organizationId?: string;
  token: string; // Token de acceso seguro para el proveedor
  supplierId: string;
  supplierName: string;
  supplierEmail: string;
  currency: Currency; // Moneda en la que oferta (USD, MXN, EUR)
  exchangeRateAtSubmission: number; // Tipo de cambio congelado al cotizar
  validityDays: number; // DÍAS DE VIGENCIA DEL PRECIO (Garantía contra aumentos)
  paymentTerms: string; // ej. "Crédito 30 días", "Contado", "50% anticipo"
  warrantyMonths: number;
  generalNotes?: string;
  items: QuotationItemBid[];
  submittedAt: string;
  isAwarded?: boolean;
}

export interface ComparisonItemRow {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  referencePriceMxn: number;
  bidsBySupplier: {
    [supplierId: string]: {
      originalPrice: number;
      originalCurrency: Currency;
      priceInBaseMxn: number;
      totalInBaseMxn: number;
      leadTimeDays: number;
      brand?: string;
      isLowest?: boolean;
    };
  };
}

export interface SupplierSummaryScore {
  supplierId: string;
  supplierName: string;
  quotationId: string;
  originalCurrency: Currency;
  totalOriginal: number;
  totalBaseMxn: number;
  avgLeadTimeDays: number;
  validityDays: number;
  paymentTerms: string;
  savingsAmountMxn: number; // Ahorro en $ respecto al precio de referencia
  savingsPercent: number;   // Ahorro en %
  isRecommended: boolean;   // Mejor balance precio/tiempo
  isAwarded: boolean;
}

// -------------------------------------------------------------
// COTIZACIONES RÁPIDAS (SPOT BUYING / COMPRAS DE URGENCIA)
// -------------------------------------------------------------
export type SpotUrgency = 'urgent_4h' | 'urgent_24h' | 'standard_48h';

export interface SpotBid {
  id: string;
  supplierId: string;
  supplierName: string;
  unitPrice: number;
  currency: Currency;
  deliveryTimeHours: number;
  availability: 'in_stock' | 'next_day' | 'on_order';
  brandNotes: string;
  validityHours: number;
  submittedAt: string;
  isAccepted?: boolean;
}

export interface SpotRequest {
  id: string;
  organizationId: string;
  organizationName: string;
  code: string; // ej. SPOT-2026-0012
  title: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  urgency: SpotUrgency;
  deadlineHours: number;
  photoUrl?: string;
  partNumberOrRef?: string;
  status: 'active' | 'awarded' | 'expired';
  targetPlant: string;
  bids: SpotBid[];
  createdAt: string;
}

// -------------------------------------------------------------
// AUTENTICACIÓN Y ROLES DE USUARIO
// -------------------------------------------------------------
export type UserRole = 'buyer' | 'supplier' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  jobTitle: string;
  organizationId?: string; // Para rol 'buyer' (ej. org-1)
  organizationName?: string;
  supplierId?: string;     // Para rol 'supplier' (ej. sup-1)
  supplierName?: string;
  avatarUrl?: string;
}

export interface DemoAccount {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  jobTitle: string;
  companyName: string;
  entityId: string; // orgId o supId
  description: string;
  initials: string;
}

