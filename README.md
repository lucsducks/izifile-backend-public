
# 📁 Izifile Backend

## 📝 Descripción del Proyecto

¡Bienvenido al backend del proyecto Izifile! Izifile es una aplicación que facilita la transferencia de archivos entre servidores utilizando los protocolos SFTP y SSH. Este proyecto está construido con Node.js y utiliza MongoDB como base de datos.

## 📋 Requisitos

-   🟢 **Node.js**
-   🟢 **MongoDB**

## ⚙️ Instalación
1. Clonar el repositorio:
    ```sh
    git clone https://github.com/tu-usuario/izifile-backend.git
    cd izifile-backend
    ```

2. Configurar el archivo `.env`:
    Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables de entorno:
    ```env
    PORT=puerto_del_servidor
    MONGODB_CNN=uri_de_conexion_a_mongodb
    SECRETORPRIVATEKEY=clave de token
    ```

3. Crear la tabla `roles` en la base de datos:
    En tu base de datos MongoDB, crea una colección llamada `roles`. Luego, añade manualmente los siguientes roles:
    ```json
    {
      "rol": "USER_ROLE"
    },
    {
      "rol": "DEV_ROLE"
    }
    ```

4. Instalar las dependencias:
    ```sh
    npm install
    ```

5. Iniciar el servidor:
    ```sh
    npm run start
    ```





## 🚀 Uso

Después de seguir los pasos anteriores, tu servidor estará configurado para conectarse con el Frontend que se encuentra en este repositorio [Izifile Frontend](git@github.com:lucsducks/izifile-frontend.git). Puedes probar las rutas y funcionalidades utilizando herramientas como Postman.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📬 Contacto

Para cualquier consulta, por favor, contacta al desarrollador a través de 2021460003@unheval.pe.
![Estructura del Proyecto](\assets\image.png)
