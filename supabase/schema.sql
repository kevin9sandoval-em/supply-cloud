-- =====================================================================
-- ESQUEMA DE BASE DE DATOS POSTGRESQL PARA SUPPLY-CLOUD (SUPABASE)
-- =====================================================================
-- Incluye arquitectura Multi-Tenant, subasta a ciegas, cotizaciones spot,
-- catálogo de productos y políticas de seguridad RLS (Row-Level Security).
-- =====================================================================

-- 1. TABLA: ORGANIZACIONES (Empresas Clientes)
CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    legal_name TEXT NOT NULL,
    tax_id TEXT NOT NULL,
    industry TEXT NOT NULL,
    city TEXT NOT NULL,
    logo_url TEXT,
    base_currency TEXT NOT NULL DEFAULT 'MXN',
    delivery_address TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABLA: CATEGORÍAS (Familias de Productos)
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    icon_name TEXT DEFAULT 'Boxes',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABLA: PRODUCTOS (Catálogo Maestro con Fotos y Costos de Referencia)
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT 'Pza',
    photo_url TEXT,
    reference_price_mxn NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    technical_specs TEXT,
    min_stock INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABLA: PROVEEDORES HOMOLOGADOS
CREATE TABLE IF NOT EXISTS suppliers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    phone TEXT,
    tax_id TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    category TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABLA: LICITACIONES (RFQs)
CREATE TABLE IF NOT EXISTS rfqs (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'open', -- 'open', 'evaluating', 'awarded', 'closed'
    deadline TIMESTAMPTZ NOT NULL,
    base_currency TEXT NOT NULL DEFAULT 'MXN',
    invited_supplier_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    awarded_supplier_id TEXT REFERENCES suppliers(id),
    awarded_quotation_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TABLA: PARTIDAS DE LICITACIÓN (RFQ Items)
CREATE TABLE IF NOT EXISTS rfq_items (
    id TEXT PRIMARY KEY,
    rfq_id TEXT NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    sku TEXT NOT NULL,
    photo_url TEXT,
    unit TEXT NOT NULL,
    quantity NUMERIC(12, 2) NOT NULL DEFAULT 1,
    spec_notes TEXT,
    reference_price_mxn NUMERIC(14, 2) NOT NULL DEFAULT 0.00
);

-- 7. TABLA: COTIZACIONES DE PROVEEDORES A CIEGAS
CREATE TABLE IF NOT EXISTS quotations (
    id TEXT PRIMARY KEY,
    rfq_id TEXT NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    supplier_id TEXT NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    supplier_name TEXT NOT NULL,
    supplier_email TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'MXN', -- 'MXN', 'USD', 'EUR'
    exchange_rate_at_submission NUMERIC(10, 4) NOT NULL DEFAULT 1.0,
    validity_days INTEGER NOT NULL DEFAULT 30, -- Vigencia del precio obligatoria
    payment_terms TEXT DEFAULT 'Crédito 30 días',
    warranty_months INTEGER DEFAULT 12,
    general_notes TEXT,
    is_awarded BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TABLA: PARTIDAS DE COTIZACIÓN (Quotation Items)
CREATE TABLE IF NOT EXISTS quotation_items (
    id TEXT PRIMARY KEY,
    quotation_id TEXT NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    unit_price NUMERIC(14, 2) NOT NULL,
    lead_time_days INTEGER NOT NULL DEFAULT 5,
    brand_or_model TEXT,
    notes TEXT
);

-- 9. TABLA: COTIZACIONES RÁPIDAS (Spot Buying / Urgencias de Planta)
CREATE TABLE IF NOT EXISTS spot_requests (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    quantity NUMERIC(12, 2) NOT NULL DEFAULT 1,
    unit TEXT NOT NULL DEFAULT 'Pza',
    urgency TEXT NOT NULL DEFAULT 'urgent_4h', -- 'urgent_4h', 'urgent_24h', 'standard_48h'
    deadline_hours INTEGER NOT NULL DEFAULT 4,
    photo_url TEXT,
    part_number_or_ref TEXT,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'awarded', 'expired'
    target_plant TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. TABLA: OFERTAS SPOT DE PROVEEDORES
CREATE TABLE IF NOT EXISTS spot_bids (
    id TEXT PRIMARY KEY,
    spot_request_id TEXT NOT NULL REFERENCES spot_requests(id) ON DELETE CASCADE,
    supplier_id TEXT NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    supplier_name TEXT NOT NULL,
    unit_price NUMERIC(14, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'MXN',
    delivery_time_hours INTEGER NOT NULL DEFAULT 2,
    availability TEXT DEFAULT 'in_stock',
    brand_notes TEXT,
    validity_hours INTEGER DEFAULT 12,
    is_accepted BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- ROW-LEVEL SECURITY (RLS) PARA AISLAMIENTO TOTAL ENTRE CLIENTES
-- =====================================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE spot_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE spot_bids ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura/escritura pública con llave anónima para desarrollo
DROP POLICY IF EXISTS "Public full access to organizations" ON organizations;
CREATE POLICY "Public full access to organizations" ON organizations FOR ALL USING (true);

DROP POLICY IF EXISTS "Public full access to categories" ON categories;
CREATE POLICY "Public full access to categories" ON categories FOR ALL USING (true);

DROP POLICY IF EXISTS "Public full access to products" ON products;
CREATE POLICY "Public full access to products" ON products FOR ALL USING (true);

DROP POLICY IF EXISTS "Public full access to suppliers" ON suppliers;
CREATE POLICY "Public full access to suppliers" ON suppliers FOR ALL USING (true);

DROP POLICY IF EXISTS "Public full access to rfqs" ON rfqs;
CREATE POLICY "Public full access to rfqs" ON rfqs FOR ALL USING (true);

DROP POLICY IF EXISTS "Public full access to rfq_items" ON rfq_items;
CREATE POLICY "Public full access to rfq_items" ON rfq_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Public full access to quotations" ON quotations;
CREATE POLICY "Public full access to quotations" ON quotations FOR ALL USING (true);

DROP POLICY IF EXISTS "Public full access to quotation_items" ON quotation_items;
CREATE POLICY "Public full access to quotation_items" ON quotation_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Public full access to spot_requests" ON spot_requests;
CREATE POLICY "Public full access to spot_requests" ON spot_requests FOR ALL USING (true);

DROP POLICY IF EXISTS "Public full access to spot_bids" ON spot_bids;
CREATE POLICY "Public full access to spot_bids" ON spot_bids FOR ALL USING (true);

-- =====================================================================
-- DATOS SEMILLA INICIALES (SEED DATA)
-- =====================================================================
INSERT INTO organizations (id, name, legal_name, tax_id, industry, city, base_currency, delivery_address)
VALUES 
('org-1', 'Manufacturas del Norte', 'Manufacturas del Norte S.A. de C.V.', 'MNO850412KJ1', 'Metalmecánica, Ensamble y Maquila', 'Monterrey, N.L.', 'MXN', 'Parque Industrial Kalos, Av. Kalos 120, Apodaca, N.L. C.P. 66600'),
('org-2', 'Alimentos & Bebidas Santa Clara', 'Alimentos & Bebidas Santa Clara S.A. de C.V.', 'ASC920914MM3', 'Procesamiento de Alimentos y Lácteos', 'Querétaro, Qro.', 'MXN', 'Parque Industrial Benito Juárez, Acceso III #14, Querétaro, Qro. C.P. 76120'),
('org-3', 'Constructora e Infraestructura del Bajío', 'Constructora e Infraestructura del Bajío S.A.', 'CIB040315GH7', 'Construcción Pesada y Obra Civil', 'León, Gto.', 'MXN', 'Blvd. Aeropuerto 1024, Col. San Carlos, León, Gto. C.P. 37295')
ON CONFLICT (id) DO NOTHING;

INSERT INTO suppliers (id, name, company_name, contact_email, phone, tax_id, rating, category, is_verified)
VALUES
('sup-1', 'Distribuidora Industrial del Norte', 'DINOR S.A. de C.V.', 'ventas@dinor-industrial.com.mx', '+52 81 8345 6789', 'DIN890412KJ1', 4.8, 'Mantenimiento y Transmisión', true),
('sup-2', 'Apex Global Supply LLC', 'Apex Industrial USA', 'bids@apexmetalsupply.com', '+1 (713) 555-0199', 'US-849201992', 4.9, 'Tubería, Válvulas y Metales', true),
('sup-3', 'Equipos Hidráulicos y Automatización Bajío', 'EHAB S.A. de C.V.', 'cotizaciones@ehabajio.com', '+52 442 211 4455', 'EHA120304MM9', 4.6, 'Automatización y Motores', true),
('sup-4', 'Seguridad y Suministros Industriales 360', 'SSI 360 S.A. de C.V.', 'ventas@ssi360.com.mx', '+52 55 5890 1234', 'SSI150618GH4', 4.9, 'EPP y Seguridad Industrial', true),
('sup-5', 'Tornillería y Fijaciones Especiales de México', 'TORFIMEX S.A. de C.V.', 'pedidos@torfimex.mx', '+52 33 3612 9000', 'TFM080922TR8', 4.7, 'Ferretería y Tornillería Industrial', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, organization_id, name, slug, description, icon_name)
VALUES
('cat-epp', 'org-1', 'EPP y Seguridad Industrial', 'epp-seguridad', 'Equipos de protección personal normados (cascos, guantes, calzado y protección visual).', 'Shield'),
('cat-ferreteria', 'org-1', 'Ferretería y Tornillería Industrial', 'ferreteria-tornilleria', 'Tornillería de alta resistencia (Grado 5, 8.8, B7), arandelas, selladores y consumibles de taller.', 'Wrench'),
('cat-valvulas', 'org-1', 'Válvulas y Tubería', 'valvulas-tuberia', 'Válvulas de bola, mariposa, retención y tubería en acero inoxidable y al carbón.', 'Pipette'),
('cat-transmision', 'org-1', 'Transmisión de Potencia', 'transmision-potencia', 'Rodamientos industriales, chumaceras, bandas dentadas y poleas.', 'Settings')
ON CONFLICT (id) DO NOTHING;
