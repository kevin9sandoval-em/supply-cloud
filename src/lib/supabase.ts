import { createClient } from '@supabase/supabase-js';
import { Product, RFQ, Quotation, Category, SpotRequest, SpotBid, Supplier } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function isSupabaseConfigured(): boolean {
  return (
    supabaseUrl.length > 0 &&
    supabaseAnonKey.length > 0 &&
    !supabaseUrl.includes('tu-proyecto') &&
    supabaseUrl.startsWith('https://')
  );
}

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// =====================================================================
// OPERACIONES EN LA NUBE (PRODUCTOS)
// =====================================================================

export async function fetchProductsCloud(organizationId: string): Promise<Product[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('organization_id', organizationId);

    if (error) {
      console.warn('Error fetching cloud products:', error);
      return null;
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      organizationId: row.organization_id,
      sku: row.sku,
      name: row.name,
      description: row.description || '',
      category: row.category,
      unit: row.unit,
      photoUrl: row.photo_url || '',
      referencePriceMxn: parseFloat(row.reference_price_mxn) || 0,
      technicalSpecs: row.technical_specs || '',
      minStock: row.min_stock || 1,
    }));
  } catch (err) {
    console.warn('Supabase fetch products exception:', err);
    return null;
  }
}

export async function insertProductCloud(product: Product): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('products').insert([
      {
        id: product.id,
        organization_id: product.organizationId,
        sku: product.sku,
        name: product.name,
        description: product.description,
        category: product.category,
        unit: product.unit,
        photo_url: product.photoUrl,
        reference_price_mxn: product.referencePriceMxn,
        technical_specs: product.technicalSpecs,
        min_stock: product.minStock,
      },
    ]);
    return !error;
  } catch (err) {
    console.warn('Supabase insert product exception:', err);
    return false;
  }
}

// =====================================================================
// OPERACIONES EN LA NUBE (LICITACIONES Y REQUISICIONES)
// =====================================================================

export async function fetchRFQsCloud(organizationId: string): Promise<RFQ[] | null> {
  if (!supabase) return null;
  try {
    const { data: rfqsData, error: rfqsError } = await supabase
      .from('rfqs')
      .select('*, rfq_items(*)')
      .eq('organization_id', organizationId);

    if (rfqsError) {
      console.warn('Error fetching cloud RFQs:', rfqsError);
      return null;
    }

    return (rfqsData || []).map((row: any) => ({
      id: row.id,
      organizationId: row.organization_id,
      organizationName: row.organization_name || 'Empresa',
      organizationTaxId: row.organization_tax_id || '',
      deliveryAddress: row.delivery_address || '',
      code: row.code,
      title: row.title,
      department: row.department,
      description: row.description || '',
      status: row.status,
      deadline: row.deadline,
      baseCurrency: row.base_currency,
      invitedSupplierIds: row.invited_supplier_ids || [],
      awardedSupplierId: row.awarded_supplier_id,
      awardedQuotationId: row.awarded_quotation_id,
      createdAt: row.created_at,
      items: (row.rfq_items || []).map((it: any) => ({
        id: it.id,
        productId: it.product_id,
        productName: it.product_name,
        sku: it.sku,
        photoUrl: it.photo_url,
        unit: it.unit,
        quantity: parseFloat(it.quantity) || 1,
        specNotes: it.spec_notes,
        referencePriceMxn: parseFloat(it.reference_price_mxn) || 0,
      })),
    }));
  } catch (err) {
    console.warn('Supabase fetch RFQs exception:', err);
    return null;
  }
}

export async function insertRFQCloud(rfq: RFQ): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error: rfqErr } = await supabase.from('rfqs').insert([
      {
        id: rfq.id,
        organization_id: rfq.organizationId,
        code: rfq.code,
        title: rfq.title,
        department: rfq.department,
        description: rfq.description,
        status: rfq.status,
        deadline: rfq.deadline,
        base_currency: rfq.baseCurrency,
        invited_supplier_ids: rfq.invitedSupplierIds,
      },
    ]);

    if (rfqErr) return false;

    if (rfq.items.length > 0) {
      const itemsToInsert = rfq.items.map((it) => ({
        id: it.id,
        rfq_id: rfq.id,
        product_id: it.productId,
        product_name: it.productName,
        sku: it.sku,
        photo_url: it.photoUrl,
        unit: it.unit,
        quantity: it.quantity,
        spec_notes: it.specNotes,
        reference_price_mxn: it.referencePriceMxn,
      }));
      await supabase.from('rfq_items').insert(itemsToInsert);
    }

    return true;
  } catch (err) {
    console.warn('Supabase insert RFQ exception:', err);
    return false;
  }
}

// =====================================================================
// AUTENTICACIÓN SUPABASE (AUTH)
// =====================================================================

export async function signUpUser(
  email: string,
  password: string,
  metadata: { name: string; role: 'buyer' | 'supplier'; companyName: string; jobTitle?: string }
) {
  if (!supabase) return { user: null, error: 'Supabase no está configurado' };
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (error) return { user: null, error: error.message };
    return { user: data.user, error: null };
  } catch (err: any) {
    return { user: null, error: err.message || 'Error de conexión' };
  }
}

export async function signInUser(email: string, password: string) {
  if (!supabase) return { user: null, error: 'Supabase no está configurado' };
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { user: null, error: error.message };
    return { user: data.user, error: null };
  } catch (err: any) {
    return { user: null, error: err.message || 'Error de conexión' };
  }
}

export async function signOutUser() {
  if (!supabase) return { error: null };
  try {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function getAuthUser() {
  if (!supabase) return null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

