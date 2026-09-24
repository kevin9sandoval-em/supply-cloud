# Guía de Despliegue en Producción — Supply-Cloud

Esta guía describe cómo desplegar **Supply-Cloud** a producción con **Vercel** o **Cloudflare**, vinculando tu base de datos **Supabase** y configurando un dominio personalizado con certificado SSL automático (ej. `app.tuempresa.com` o `supplycloud.com.mx`).

---

## 1. Requisitos Previos

- Cuenta en [GitHub](https://github.com) (gratuita).
- Cuenta en [Vercel](https://vercel.com) (gratuita).
- Tu proyecto de base de datos Supabase activo (ya configurado con `schema.sql`).
- Tus dos credenciales de Supabase:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2. Paso 1: Subir el Proyecto a GitHub

Abre tu terminal en la carpeta del proyecto (`supply-cloud`):

```bash
# 1. Verificar estado de git
git status

# 2. Agregar los cambios (el archivo .env.local está protegido por .gitignore y NO se subirá)
git add .

# 3. Crear commit
git commit -m "feat: Supply-Cloud v1.0 producción con roles, subasta a ciegas, acta de fallo y Supabase"

# 4. Crear un repositorio privado en GitHub (desde github.com/new) llamado "supply-cloud"
# Y vincularlo:
git remote add origin https://github.com/TU_USUARIO/supply-cloud.git
git branch -M main
git push -u origin main
```

---

## 3. Paso 2: Desplegar en Vercel (1-Clic)

1. Ingresa a **[vercel.com](https://vercel.com)** e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"Add New..."** ➔ **"Project"**.
3. Verás tu repositorio **`supply-cloud`** en la lista. Haz clic en **"Import"**.
4. En la configuración del proyecto:
   - **Framework Preset**: Detectará automáticamente `Next.js`.
   - **Root Directory**: `./`
5. Despliega la sección **"Environment Variables"** y agrega tus dos claves:
   - Nombre: `NEXT_PUBLIC_SUPABASE_URL` | Valor: `https://yuwyuyfmkfbrymaniain.supabase.co`
   - Nombre: `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Valor: `sb_publishable_uEUAFJbr8t6SevFS5M_I6A_KHAr09YQ`
6. Haz clic en el botón azul **"Deploy"**.

En aproximadamente **1 a 2 minutos**, Vercel compilará la aplicación y te entregará una URL global con HTTPS de alta velocidad (ej. `https://supply-cloud.vercel.app`).

---

## 4. Paso 3: Asignar tu Dominio Personalizado

Para usar el dominio corporativo de tu empresa (ej. `app.tuempresa.com` o `supplycloud.mx`):

1. En el panel de tu proyecto en Vercel, entra a **Settings** ➔ **Domains**.
2. Escribe tu dominio o subdominio y haz clic en **Add**.
3. Vercel te indicará el registro DNS que debes agregar en tu registrador de dominios (GoDaddy, Namecheap, Cloudflare, Neubox, etc.):
   - **Para subdominios** (ej. `app.tuempresa.com`):
     - Tipo: `CNAME`
     - Nombre / Host: `app`
     - Valor / Destino: `cname.vercel-dns.com`
   - **Para dominios raíz** (ej. `supplycloud.mx`):
     - Tipo: `A`
     - Nombre / Host: `@`
     - Valor / IP: `76.76.21.21`
4. Una vez propagado el DNS (tarda de 2 a 15 minutos), Vercel generará el **Certificado SSL / HTTPS** de 256 bits de forma totalmente gratuita y automática.

---

## 5. Resumen de Seguridad y Cumplimiento B2B

- **Aislamiento Multi-Tenant**: Cada cliente comprador únicamente tiene visibilidad sobre su propio catálogo, licitaciones y compras spot.
- **Subasta a Ciegas (Blind Bidding)**: Ningún proveedor puede ver precios, ofertas ni nombres de competidores durante el proceso licitatorio.
- **Vigencia de Precios**: Queda estipulada de manera contractual e irrevocable en el Acta de Fallo generada.
