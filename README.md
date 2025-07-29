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