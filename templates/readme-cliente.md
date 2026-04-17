# [Nombre del Proyecto]

Sitio web / aplicación desarrollada para [Cliente]. Stack: Next.js + Supabase + TypeScript.

---

## Requisitos

- Node.js 20+
- npm 10+

## Correr localmente

```bash
# 1. Clonar el repositorio
git clone https://github.com/emi1307-nomo/NOMBRE-REPO.git
cd NOMBRE-REPO

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Completar .env.local con los valores reales

# 4. Correr en desarrollo
npm run dev
# → http://localhost:3000
```

## Variables de entorno

Ver `.env.example` para la lista completa. Pedir los valores reales a Emiliano Rodriguez.

## Deploy

El proyecto corre en DigitalOcean VPS. Para deployar cambios:

```bash
ssh root@IP_DEL_SERVIDOR
cd /var/www/app
bash deploy.sh
```

## Estructura del proyecto

```
src/
├── app/          # Páginas y rutas (Next.js App Router)
├── components/   # Componentes reutilizables
├── lib/          # Utilidades y configuración
└── actions/      # Server Actions (lógica de negocio)
```

## Panel de administración

URL: `https://tudominio.com/dashboard`
Usuario: [entregar por separado]
Contraseña: [entregar por separado]

## Soporte

Emiliano Rodriguez — emilianorosa@icloud.com
30 días de soporte incluidos desde la fecha de entrega.
