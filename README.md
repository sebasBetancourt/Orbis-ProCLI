El objetivo de este proyecto es desarrollar una aplicación de línea de comandos (CLI) usando Node.js que permita a un freelancer gestionar su portafolio profesional. Esta herramienta debe incluir funcionalidades para manejar clientes, propuestas, proyectos, contratos, entregables y finanzas, permitiendo registrar ingresos y egresos, generar contratos y controlar el progreso de los entregables.



### La aplicación debe:

Estar desarrollada completamente en Node.js, aplicando Programación Orientada a Objetos.
Aplicar principios SOLID y al menos dos patrones de diseño.
Usar librerías npm que mejoren la experiencia por consola (como chalk, inquirer, dotenv, entre otras).
Persistir los datos en MongoDB, usando el driver oficial mongodb (no mongoose), y realizar operaciones con transacciones reales.
Contar con una carpeta específica /models con la definición del modelo de datos, usando objetos JavaScript que incluyan validaciones por campo (tipo de dato, requeridos, formatos, rangos, etc.).

## Funcionalidades requeridas (mínimas)


1. Gestión de clientes
Crear, listar, actualizar y eliminar clientes.
Asociar clientes a proyectos y propuestas.


2. Gestión de propuestas
Crear propuestas para clientes con descripción, precio, plazos y estado (pendiente, aceptada, rechazada).
Al ser aceptada, debe generar automáticamente un proyecto.


3. Gestión de proyectos
CRUD de proyectos.
Asociación con cliente, contrato, entregables.
Estados: activo, pausado, finalizado, cancelado.
Registro de avances.


4. Contratos
Contrato asociado al proyecto.
Campos como condiciones, fecha inicio/fin, valor total, etc.


5. Entregables
Por proyecto, con fecha límite, estado (pendiente, entregado, aprobado, rechazado).
Posibilidad de rollback mediante transacciones si el entregable se elimina o cambia estado.


6. Gestión financiera
Registro de ingresos y egresos asociados a proyectos.
Cálculo de balance por cliente o por fecha.
Transacciones para registrar pagos, evitar duplicidad o pérdidas de consistencia.


## Requisitos técnicos obligatorios

### Técnicos
- Uso de librerías de npm relevantes (e.g., inquirer, chalk, dotenv, mongoose, dayjs, etc.).
- MongoDB (usando mongodb driver, no mongoose).
- Uso de transacciones en operaciones financieras o entregables.
- Programación orientada a objetos.
- Aplicación de al menos 2 patrones de diseño (ej. Repository, Factory, Command, Observer, etc.).
- Aplicación de principios SOLID en clases y módulos.


### Organización del proyecto
- El repositorio debe estar bien estructurado en carpetas como /models, /services, /commands, /config, /utils.
- Uso obligatorio de .gitignore, README.md completo y commits con formato Conventional Commits (feat:, fix:, docs:, etc.).
- Debe evidenciar colaboración organizada si es un equipo (1 a 3 integrantes).

## Configurar *dontenv* .env para Base de Datos MongoDB
- Configura tu MongoAtlas con pegando esto (Primero crea un archivo **.env**):
  ```
  MONGODB_URI=mongodb+srv://miUsuario:miContraseña@cluster0.abc123.mongodb.net/portafolio-freelancer?retryWrites=true&w=majority
  DB_NAME=portafolio-freelancer
  ```

## Principios S.O.L.I.D
1. Cliente.js y ServiceCLiente
- (SRP) La utilizo con la clase class "mostrarCliente" separado en respossabilidad Unica imprimir los datos del cliente.
- (OCP) Principio de Abierto/Cerrado esto hace que crea un servicio "ServiceCLiente" en el que separa por comandos las funciones de /commands/client en el que sePARA CON RESPONASBAILIDADES UNICAS , en el que estan abiertas para su extension y cerradas para su modificacion con command.js "ejecutar()"



**Patrones y SOLID**:
- **Factory Method**: `PropuestaFactory` crea propuestas y proyectos, permitiendo extensión para nuevos tipos (OCP).
- **SRP**: `Propuesta` (modelo), `MostrarPropuesta` (visualización), `propuestaModel` (acceso a datos).
- **OCP**: `PropuestaFactory` es extensible.
- **DIP**: Usa `propuestaModel` como abstracción para acceso a datos.

#### 2. **Archivo: `src/utils/pedirDatosPropuesta.js`**
Recolecta datos para propuestas, usando `seleccionarClientePaginado`.



**Patrones y SOLID**:
- **SRP**: Solo recolecta datos.
- **DIP**: Usa `clienteModel` como abstracción.

#### 3. **Archivo: `src/commands/commandsPropuesta/CrearPropuestaComando.js`**
Comando para crear propuestas, usando transacciones.




### Extensión a Otras Entidades
Para proyectos, contratos, entregables, y finanzas, puedes seguir el mismo patrón:
1. **Modelos**:
   - Crear `Contrato.js`, `Entregable.js`, `Finanza.js` con clases, validaciones, y funciones como `contratoModel`.
   - Usar **Factory Method** para cada entidad (por ejemplo, `ContratoFactory`).
2. **Comandos**:
   - Crear carpetas `commands/commandsContrato/`, `commands/commandsEntregable/`, etc.
   - Implementar comandos como `CrearContratoComando`, `ActualizarEntregableComando`, etc.
3. **Servicios**:
   - Crear `ContratoService.js`, `EntregableService.js`, etc., para orquestar comandos.
4. **Transacciones**:
   - Usar sesiones de MongoDB para operaciones críticas, como registrar pagos o cambiar estados de entregables.




### Patrones de Diseño y SOLID Aplicados

1. **Factory Method**:
   - **Dónde**: En `PropuestaFactory` (`models/Propuesta.js`), `ProyectoFactory` (`models/Proyecto.js`), etc.
   - **Cómo**: Crea instancias de entidades y maneja relaciones (por ejemplo, proyecto desde propuesta).
   - **SOLID**:
     - **SRP**: La fábrica solo crea objetos.
     - **OCP**: Permite nuevos tipos de propuestas o proyectos.
     - **DIP**: Usa funciones como `propuestaModel` para acceso a datos.

2. **Command**:
   - **Dónde**: En `commands/commandsPropuesta/` y `commands/commandsClient/`.
   - **Cómo**: Cada operación CRUD es un comando (`CrearPropuestaComando`, etc.).
   - **SOLID**:
     - **SRP**: Cada comando tiene una única responsabilidad.
     - **OCP**: Puedes agregar nuevos comandos.
     - **LSP**: Los comandos son sustituibles gracias a la interfaz `Comando`.
     - **ISP**: La interfaz `Comando` define solo el método `ejecutar`.

3. **SOLID**:
   - **SRP**: `Propuesta` (modelo), `MostrarPropuesta` (visualización), `CrearPropuestaComando` (lógica de creación), `PropuestaService` (orquestación).
   - **OCP**: `PropuestaFactory` y la estructura de comandos permiten extensión.
   - **LSP**: Los comandos heredan de `Comando` y son sustituibles.
   - **ISP**: La interfaz `Comando` es mínima.
   - **DIP**: Los servicios dependen de abstracciones (`propuestaModel`, `Comando`).

### Resolución de Valores por Defecto
El problema de valores por defecto probablemente se debe a prompts no interactivos o configuraciones del entorno. Tu `pedirDatosCliente.js` tiene validaciones estrictas, lo cual es correcto. Para evitar problemas:
- Asegúrate de ejecutar en una terminal interactiva (`node index.js`).
- Verifica dependencias:
```
  npm install inquirer chalk mongodb dotenv
  ```

## EVIDENCIA SCRUM
[Documento de Planificación Scrum (PDF)] https://drive.google.com/file/d/1GLP9gJ9PLsXhbwZkK_Qv6bQaAFf9nc7f/view?usp=sharing