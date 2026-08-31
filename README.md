# Snaider App

Aplicación frontend construida con React + TypeScript + Vite para consumir la API de Snaider.

## Requisitos previos

Antes de ejecutar el proyecto necesitas tener instalado:

- Node.js 18 o superior
- npm 9 o superior
- Un backend/API disponible con la URL correcta para la variable de entorno

## Instalación

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd SnaiderApp
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto copiando la plantilla:

```bash
copy .env.example .env
```

4. Ajusta la variable `VITE_API_URL` según la URL de tu API:

```env
VITE_API_URL=http://localhost:3000
```

> Si tu backend corre en otra URL o puerto, cambia este valor por la dirección correcta.

## Ejecutar en modo desarrollo

```bash
npm run dev
```

Esto levantará la aplicación en:

```text
http://localhost:5173
```

## Compilar para producción

```bash
npm run build
```

La salida se generará en la carpeta `dist/`.

## Vista previa de la versión compilada

```bash
npm run preview
```

## Scripts disponibles

- `npm run dev` - inicia el entorno de desarrollo
- `npm run build` - genera la versión de producción
- `npm run preview` - sirve la build generada
- `npm run lint` - revisa el código con ESLint



