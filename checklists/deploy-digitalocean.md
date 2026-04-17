# Deploy a DigitalOcean VPS — Next.js + Supabase

## Primera vez (setup del servidor)

```bash
# 1. Conectarse al VPS
ssh root@IP_DEL_SERVIDOR

# 2. Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Instalar PM2 (process manager)
npm install -g pm2

# 4. Instalar Nginx
sudo apt install nginx -y

# 5. Clonar repo
git clone https://github.com/emi1307-nomo/NOMBRE-REPO.git /var/www/app
cd /var/www/app

# 6. Crear .env.local con todas las variables
nano .env.local

# 7. Instalar dependencias y buildear
npm install
npm run build

# 8. Iniciar con PM2
pm2 start npm --name "app" -- start
pm2 save
pm2 startup
```

## Configurar Nginx como reverse proxy

```nginx
# /etc/nginx/sites-available/app
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL con Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tudominio.com -d www.tudominio.com
# Renovación automática ya queda configurada
```

## Deploy de actualizaciones

```bash
# En el VPS — o crear un script deploy.sh
cd /var/www/app
git pull origin main
npm install
npm run build
pm2 restart app
```

### Script deploy.sh (guardar en raíz del proyecto)

```bash
#!/bin/bash
set -e
echo "Pulling latest changes..."
git pull origin main
echo "Installing dependencies..."
npm install
echo "Building..."
npm run build
echo "Restarting app..."
pm2 restart app
echo "Deploy complete!"
```

```bash
chmod +x deploy.sh
# Para deployar: bash deploy.sh
```

## Comandos PM2 útiles

```bash
pm2 list          # Ver estado de todos los procesos
pm2 logs app      # Ver logs en tiempo real
pm2 restart app   # Reiniciar
pm2 stop app      # Detener
pm2 monit         # Monitor de CPU/RAM
```

## Variables de entorno

Siempre en `/var/www/app/.env.local`. Nunca en el código, nunca en el repo.
Después de cambiar variables: `npm run build && pm2 restart app`
