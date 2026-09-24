'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Supplier,
  RFQ,
  Quotation,
  CurrencyRate,
  Category,
  SpotRequest,
  SpotBid,
  Organization,
  UserProfile,
  DemoAccount,
  UserRole,
} from '@/types';
import {
  INITIAL_ORGANIZATIONS,
  INITIAL_PRODUCTS,
  INITIAL_SUPPLIERS,
  INITIAL_RFQS,
  INITIAL_QUOTATIONS,
  INITIAL_CATEGORIES,
  INITIAL_SPOT_REQUESTS,
  DEFAULT_RATES,
  INITIAL_DEMO_USERS,
  DEFAULT_USER,
  getStoredData,
  setStoredData,
} from '@/lib/store';
import {
  isSupabaseConfigured,
  fetchProductsCloud,
  insertProductCloud,
  fetchRFQsCloud,
  insertRFQCloud,
  signInUser,
  signUpUser,
  signOutUser,
} from '@/lib/supabase';

interface AppContextType {
  organizations: Organization[];
  activeOrgId: string;
  activeOrg: Organization;
  setActiveOrgId: (id: string) => void;
  isCloudConfigured: boolean;
  currentUser: UserProfile | null;
  demoAccounts: DemoAccount[];
  activeSupplierId: string;
  setActiveSupplierId: (id: string) => void;
  loginWithDemo: (demoId: string) => void;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (
    email: string,
    password: string,
    metadata: { name: string; role: 'buyer' | 'supplier'; companyName: string; jobTitle?: string }
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  products: Product[];
  allProducts: Product[];
  suppliers: Supplier[];
  rfqs: RFQ[];
  allRfqs: RFQ[];
  quotations: Quotation[];
  categories: Category[];
  spotRequests: SpotRequest[];
  rates: CurrencyRate[];
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  addProduct: (product: Omit<Product, 'id' | 'organizationId'>) => Product;
  addBulkProducts: (productsList: Omit<Product, 'id' | 'organizationId'>[]) => number;
  addCategory: (cat: { name: string; description: string; iconName?: string }) => Category;
  createRFQ: (rfqData: Omit<RFQ, 'id' | 'code' | 'createdAt' | 'organizationId' | 'organizationName' | 'organizationTaxId' | 'deliveryAddress'>) => RFQ;
  submitQuotation: (quoteData: Omit<Quotation, 'id' | 'submittedAt'>) => Quotation;
  awardRFQ: (rfqId: string, supplierId: string, quotationId: string) => void;
  createSpotRequest: (req: Omit<SpotRequest, 'id' | 'code' | 'createdAt' | 'bids' | 'status' | 'organizationId' | 'organizationName'>) => SpotRequest;
  submitSpotBid: (spotId: string, bid: Omit<SpotBid, 'id' | 'submittedAt'>) => void;
  acceptSpotBid: (spotId: string, bidId: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [organizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [activeOrgId, setActiveOrgId] = useState<string>('org-1');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [activeSupplierId, setActiveSupplierId] = useState<string>('sup-1');
  const demoAccounts = INITIAL_DEMO_USERS;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [allRfqs, setAllRfqs] = useState<RFQ[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allSpotRequests, setAllSpotRequests] = useState<SpotRequest[]>([]);
  const [rates] = useState<CurrencyRate[]>(DEFAULT_RATES);
  const [activeRole, setActiveRole] = useState<UserRole>('buyer');
  const [isLoaded, setIsLoaded] = useState(false);
  const isCloudConfigured = isSupabaseConfigured();

  // Cargar datos al inicio desde localStorage o iniciales
  useEffect(() => {
    const loadedOrgId = getStoredData('sc_active_org_v3', 'org-1');
    const loadedUser = getStoredData('sc_current_user_v4', DEFAULT_USER);
    const loadedSupId = getStoredData('sc_active_sup_v4', 'sup-1');
    const loadedProducts = getStoredData('sc_products_v3', INITIAL_PRODUCTS);
    const loadedSuppliers = getStoredData('sc_suppliers_v3', INITIAL_SUPPLIERS);
    const loadedRfqs = getStoredData('sc_rfqs_v3', INITIAL_RFQS);
    const loadedQuotations = getStoredData('sc_quotations_v3', INITIAL_QUOTATIONS);
    const loadedCategories = getStoredData('sc_categories_v3', INITIAL_CATEGORIES);
    const loadedSpots = getStoredData('sc_spots_v3', INITIAL_SPOT_REQUESTS);

    setActiveOrgId(loadedOrgId);
    setCurrentUser(loadedUser);
    setActiveSupplierId(loadedSupId);
    if (loadedUser?.role) {
      setActiveRole(loadedUser.role);
    }
    setAllProducts(loadedProducts);
    setSuppliers(loadedSuppliers);
    setAllRfqs(loadedRfqs);
    setQuotations(loadedQuotations);
    setAllCategories(loadedCategories);
    setAllSpotRequests(loadedSpots);
    setIsLoaded(true);
  }, []);

  // Sincronizar en localStorage
  useEffect(() => {
    if (!isLoaded) return;
    setStoredData('sc_active_org_v3', activeOrgId);
  }, [activeOrgId, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    setStoredData('sc_current_user_v4', currentUser);
  }, [currentUser, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    setStoredData('sc_active_sup_v4', activeSupplierId);
  }, [activeSupplierId, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    setStoredData('sc_products_v3', allProducts);
  }, [allProducts, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    setStoredData('sc_rfqs_v3', allRfqs);
  }, [allRfqs, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    setStoredData('sc_quotations_v3', quotations);
  }, [quotations, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    setStoredData('sc_categories_v3', allCategories);
  }, [allCategories, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    setStoredData('sc_spots_v3', allSpotRequests);
  }, [allSpotRequests, isLoaded]);

  // Entidades activas filtradas estrictamente por organización activa (Multi-Tenant Scoping)
  const activeOrg = organizations.find((o) => o.id === activeOrgId) || organizations[0];
  const products = allProducts.filter((p) => p.organizationId === activeOrgId);
  const rfqs = allRfqs.filter((r) => r.organizationId === activeOrgId);
  const categories = allCategories.filter((c) => c.organizationId === activeOrgId);
  const spotRequests = allSpotRequests.filter((s) => s.organizationId === activeOrgId);

  const addProduct = (newProd: Omit<Product, 'id' | 'organizationId'>): Product => {
    const created: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      organizationId: activeOrgId,
    };
    setAllProducts((prev) => [created, ...prev]);

    if (isCloudConfigured) {
      insertProductCloud(created);
    }

    setAllCategories((prev) =>
      prev.map((c) =>
        c.organizationId === activeOrgId && c.name.toLowerCase() === newProd.category.toLowerCase()
          ? { ...c, productCount: c.productCount + 1 }
          : c
      )
    );

    return created;
  };

  const addBulkProducts = (productsList: Omit<Product, 'id' | 'organizationId'>[]): number => {
    const timestamp = Date.now();
    const createdBatch: Product[] = productsList.map((p, idx) => ({
      ...p,
      id: `prod-bulk-${timestamp}-${idx}`,
      organizationId: activeOrgId,
    }));

    setAllProducts((prev) => [...createdBatch, ...prev]);

    // Actualizar conteos en categorías
    setAllCategories((prev) => {
      const updated = [...prev];
      createdBatch.forEach((prod) => {
        const cat = updated.find(
          (c) => c.organizationId === activeOrgId && c.name.toLowerCase() === prod.category.toLowerCase()
        );
        if (cat) {
          cat.productCount += 1;
        } else {
          // Si es una categoría nueva, darla de alta automáticamente
          const slug = prod.category.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
          updated.push({
            id: `cat-auto-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            organizationId: activeOrgId,
            name: prod.category,
            slug,
            description: `Categoría importada con productos de ${prod.category}`,
            iconName: 'Boxes',
            productCount: 1,
          });
        }
      });
      return updated;
    });

    return createdBatch.length;
  };

  const addCategory = (cat: { name: string; description: string; iconName?: string }): Category => {
    const slug = cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      organizationId: activeOrgId,
      name: cat.name.trim(),
      slug,
      description: cat.description.trim(),
      iconName: cat.iconName || 'Boxes',
      productCount: 0,
    };
    setAllCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const createRFQ = (
    rfqData: Omit<RFQ, 'id' | 'code' | 'createdAt' | 'organizationId' | 'organizationName' | 'organizationTaxId' | 'deliveryAddress'>
  ): RFQ => {
    const count = allRfqs.length + 1;
    const code = `RFQ-2026-${String(count + 100).padStart(4, '0')}`;
    const newRfq: RFQ = {
      ...rfqData,
      id: `rfq-${Date.now()}`,
      organizationId: activeOrgId,
      organizationName: activeOrg.legalName,
      organizationTaxId: activeOrg.taxId,
      deliveryAddress: activeOrg.deliveryAddress,
      code,
      createdAt: new Date().toISOString(),
    };
    setAllRfqs((prev) => [newRfq, ...prev]);

    if (isCloudConfigured) {
      insertRFQCloud(newRfq);
    }
    return newRfq;
  };

  const submitQuotation = (quoteData: Omit<Quotation, 'id' | 'submittedAt'>): Quotation => {
    const newQuotation: Quotation = {
      ...quoteData,
      id: `quot-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };

    setQuotations((prev) => {
      const filtered = prev.filter(
        (q) => !(q.rfqId === quoteData.rfqId && q.supplierId === quoteData.supplierId)
      );
      return [...filtered, newQuotation];
    });

    setAllRfqs((prev) =>
      prev.map((r) => (r.id === quoteData.rfqId && r.status === 'open' ? { ...r, status: 'evaluating' } : r))
    );

    return newQuotation;
  };

  const awardRFQ = (rfqId: string, supplierId: string, quotationId: string) => {
    setAllRfqs((prev) =>
      prev.map((r) =>
        r.id === rfqId
          ? {
              ...r,
              status: 'awarded',
              awardedSupplierId: supplierId,
              awardedQuotationId: quotationId,
            }
          : r
      )
    );

    setQuotations((prev) =>
      prev.map((q) =>
        q.rfqId === rfqId ? { ...q, isAwarded: q.id === quotationId } : q
      )
    );
  };

  const createSpotRequest = (
    req: Omit<SpotRequest, 'id' | 'code' | 'createdAt' | 'bids' | 'status' | 'organizationId' | 'organizationName'>
  ): SpotRequest => {
    const count = allSpotRequests.length + 1;
    const code = `SPOT-2026-${String(count + 10).padStart(4, '0')}`;
    const newSpot: SpotRequest = {
      ...req,
      id: `spot-${Date.now()}`,
      organizationId: activeOrgId,
      organizationName: activeOrg.legalName,
      code,
      status: 'active',
      bids: [],
      createdAt: new Date().toISOString(),
    };
    setAllSpotRequests((prev) => [newSpot, ...prev]);
    return newSpot;
  };

  const submitSpotBid = (
    spotId: string,
    bid: Omit<SpotBid, 'id' | 'submittedAt'>
  ) => {
    const newBid: SpotBid = {
      ...bid,
      id: `sbid-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    setAllSpotRequests((prev) =>
      prev.map((s) =>
        s.id === spotId ? { ...s, bids: [...s.bids, newBid] } : s
      )
    );
  };

  const acceptSpotBid = (spotId: string, bidId: string) => {
    setAllSpotRequests((prev) =>
      prev.map((s) => {
        if (s.id !== spotId) return s;
        return {
          ...s,
          status: 'awarded',
          bids: s.bids.map((b) => ({
            ...b,
            isAccepted: b.id === bidId,
          })),
        };
      })
    );
  };

  const loginWithDemo = (demoId: string) => {
    const account = demoAccounts.find((a) => a.id === demoId);
    if (!account) return;
    const profile: UserProfile = {
      id: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
      jobTitle: account.jobTitle,
      organizationId: account.role === 'buyer' ? account.entityId : undefined,
      organizationName: account.role === 'buyer' ? account.companyName : undefined,
      supplierId: account.role === 'supplier' ? account.entityId : undefined,
      supplierName: account.role === 'supplier' ? account.companyName : undefined,
    };
    setCurrentUser(profile);
    setActiveRole(account.role);
    if (account.role === 'buyer') {
      setActiveOrgId(account.entityId);
    } else {
      setActiveSupplierId(account.entityId);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    const res = await signInUser(email, password);
    if (res.error) {
      return { success: false, error: res.error };
    }
    const meta = (res.user as any)?.user_metadata || {};
    const role: UserRole = meta.role === 'supplier' ? 'supplier' : 'buyer';
    const profile: UserProfile = {
      id: res.user?.id || 'usr-custom',
      email: res.user?.email || email,
      name: meta.name || email.split('@')[0],
      role,
      jobTitle: meta.jobTitle || (role === 'buyer' ? 'Comprador' : 'Representante Comercial'),
      organizationId: role === 'buyer' ? 'org-1' : undefined,
      organizationName: role === 'buyer' ? (meta.companyName || 'Empresa Cliente') : undefined,
      supplierId: role === 'supplier' ? 'sup-1' : undefined,
      supplierName: role === 'supplier' ? (meta.companyName || 'Proveedor Homologado') : undefined,
    };
    setCurrentUser(profile);
    setActiveRole(role);
    return { success: true };
  };

  const registerWithEmail = async (
    email: string,
    password: string,
    metadata: { name: string; role: 'buyer' | 'supplier'; companyName: string; jobTitle?: string }
  ) => {
    const res = await signUpUser(email, password, metadata);
    if (res.error) {
      return { success: false, error: res.error };
    }
    const profile: UserProfile = {
      id: res.user?.id || 'usr-new',
      email: res.user?.email || email,
      name: metadata.name,
      role: metadata.role,
      jobTitle: metadata.jobTitle || (metadata.role === 'buyer' ? 'Comprador' : 'Representante Comercial'),
      organizationId: metadata.role === 'buyer' ? 'org-1' : undefined,
      organizationName: metadata.role === 'buyer' ? metadata.companyName : undefined,
      supplierId: metadata.role === 'supplier' ? 'sup-1' : undefined,
      supplierName: metadata.role === 'supplier' ? metadata.companyName : undefined,
    };
    setCurrentUser(profile);
    setActiveRole(metadata.role);
    return { success: true };
  };

  const logout = async () => {
    await signOutUser();
    setCurrentUser(null);
  };

  const resetDemoData = () => {
    setActiveOrgId('org-1');
    setCurrentUser(DEFAULT_USER);
    setActiveSupplierId('sup-1');
    setAllProducts(INITIAL_PRODUCTS);
    setSuppliers(INITIAL_SUPPLIERS);
    setAllRfqs(INITIAL_RFQS);
    setQuotations(INITIAL_QUOTATIONS);
    setAllCategories(INITIAL_CATEGORIES);
    setAllSpotRequests(INITIAL_SPOT_REQUESTS);
    setStoredData('sc_active_org_v3', 'org-1');
    setStoredData('sc_current_user_v4', DEFAULT_USER);
    setStoredData('sc_active_sup_v4', 'sup-1');
    setStoredData('sc_products_v3', INITIAL_PRODUCTS);
    setStoredData('sc_suppliers_v3', INITIAL_SUPPLIERS);
    setStoredData('sc_rfqs_v3', INITIAL_RFQS);
    setStoredData('sc_quotations_v3', INITIAL_QUOTATIONS);
    setStoredData('sc_categories_v3', INITIAL_CATEGORIES);
    setStoredData('sc_spots_v3', INITIAL_SPOT_REQUESTS);
  };

  return (
    <AppContext.Provider
      value={{
        organizations,
        activeOrgId,
        activeOrg,
        setActiveOrgId,
        isCloudConfigured,
        currentUser,
        demoAccounts,
        activeSupplierId,
        setActiveSupplierId,
        loginWithDemo,
        loginWithEmail,
        registerWithEmail,
        logout,
        products,
        allProducts,
        suppliers,
        rfqs,
        allRfqs,
        quotations,
        categories,
        spotRequests,
        rates,
        activeRole,
        setActiveRole,
        addProduct,
        addBulkProducts,
        addCategory,
        createRFQ,
        submitQuotation,
        awardRFQ,
        createSpotRequest,
        submitSpotBid,
        acceptSpotBid,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
