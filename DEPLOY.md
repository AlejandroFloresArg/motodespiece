# Guía de Despliegue - MotoDespiece

Esta guía detalla los pasos para llevar el proyecto MotoDespiece desde tu computadora (localhost) a producción en internet.

## 1. Subir el código a GitHub
1. Crea una cuenta en [GitHub](https://github.com/) si no tienes una.
2. Crea un nuevo repositorio **privado** (para no exponer tu código).
3. En tu terminal de Visual Studio Code, ejecuta los siguientes comandos:
   \`\`\`bash
   git init
   git add .
   git commit -m "Versión inicial MotoDespiece"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   \`\`\`

## 2. Despliegue en Vercel
1. Crea una cuenta en [Vercel](https://vercel.com/) usando tu cuenta de GitHub.
2. Haz clic en "Add New..." y selecciona "Project".
3. Importa el repositorio de MotoDespiece que acabas de subir a GitHub.
4. **IMPORTANTE:** Antes de darle a "Deploy", ve a la sección **Environment Variables**.
5. Copia TODAS las variables que tienes en tu archivo local `.env.local` y pégalas aquí. Asegúrate de incluir la contraseña de administrador.
6. Haz clic en **Deploy**. Vercel construirá tu sitio (tardará unos minutos).

## 3. Configuración de Webhooks (Crucial para que los pagos funcionen)

### Stripe
1. Ve a tu panel de [Stripe](https://dashboard.stripe.com/).
2. Activa el "Modo Prueba" (Test mode) arriba a la derecha si aún estás probando.
3. Ve a la sección de **Developers > Webhooks**.
4. Haz clic en "Add endpoint" (Agregar endpoint).
5. En "Endpoint URL", pon la URL que te dio Vercel seguida de `/api/webhook` (Ej: `https://motodespiece.vercel.app/api/webhook`).
6. En "Select events to listen to", busca y selecciona **`checkout.session.completed`**.
7. Haz clic en "Add endpoint".
8. Stripe te mostrará un "Signing secret" (suele empezar con `whsec_...`). Cópialo.
9. Ve a la configuración de tu proyecto en Vercel > Settings > Environment Variables y actualiza `STRIPE_WEBHOOK_SECRET` con este nuevo valor. (Debes hacer un nuevo *Deploy* en Vercel para que tome el cambio).

### MercadoPago
1. Ve a la [sección de desarrolladores de MercadoPago](https://mercadopago.com/developers/panel/app).
2. Entra a tu aplicación.
3. En el menú lateral, ve a **Webhooks**.
4. En "URL de producción", pon la misma URL que usaste para Stripe: `https://tudominio.com/api/webhook`.
5. En "Eventos", selecciona **Pagos** (`payment`).
6. Guarda los cambios.

## 4. Dominio Personalizado (Opcional pero recomendado)
1. Compra un dominio en registradores baratos como Namecheap o Porkbun (ej: `motodespiece.com.ar` o `.com`).
2. Ve a Vercel > Tu Proyecto > Settings > Domains.
3. Añade tu dominio. Vercel te dará unas instrucciones (generalmente agregar unos registros TXT y A en la configuración DNS de donde compraste el dominio).
4. Una vez configurado, actualiza la variable `NEXT_PUBLIC_APP_URL` en Vercel para que apunte a tu nuevo dominio.

## 5. Pasar a Producción
1. **Stripe:** Quita el "Modo Prueba". Ve a la sección "API keys" y copia las claves que empiezan con `sk_live_` y `pk_live_`. 
2. Actualiza esas variables en Vercel y asegúrate de crear un *nuevo* webhook en el modo "Live" de Stripe, obteniendo el nuevo `whsec_...`.
3. **MercadoPago:** Asegúrate de usar tus "Credenciales de Producción" (Access Token).

## Checklist Final
- [ ] ¿El catálogo carga correctamente?
- [ ] ¿Puedo entrar a `/admin` con mi contraseña?
- [ ] ¿El botón de compra lleva a Stripe/MercadoPago?
- [ ] Al hacer una compra de prueba, ¿llega el correo con Resend?
- [ ] ¿El link de descarga abre el PDF correctamente?