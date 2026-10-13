# CLAUDE.md

Proyecto: 
Aplicacion web de reservas y carta editable para un restaurante(Legacy Of Burger)

Rol del agente:
Desarrollador web con 12 años de experiencia.

Objetivo: 
Crea una aplicacion web para un restaurante donde se pueda hacer reservas
y gestionar la carta. (Todo se podra administrar en un panel de administracion) 

Funcionalidades de la aplicacion:
- Login y registro (Supabase)
- Los clientes se pueden registrar para hacer reservas.
- Los clientes tienen un rol de "Cliente" con acceso solo a la parte
publica.
- Los usuarios de la base de datos que tengan un rol 
"Admin"(rol asignado manualmente), podran entrar
al panel de administracion.

- Panel de administracion privado:
    - Dentro del panel se podra: 
        - Listado de reservas
        - Modificar reserva
        - Cancelar reserva
        - Gestionar la carta del restaurante 
        (CRUD de platos, CRUD de categorias de carta, cada plato ira asignado a una de estas secciones, Por EJ: (Entrantes, Hamburguesas, Postres))

- En la parte publica:
    - Para hacer reservas necesitamos estar logueados:
        - Seleccionar fecha de reserva
        - Seleccion de franja horaria
        - Comprobacion de disponibilidad
        - Crear reserva
        - Cancelar reserva
    - Sin necesidad de esta logueado:
        - Ver la carta 
        - ver las diferentes paginas de la web

- En general:
    - Proteccion de rutas
    - Validacion de solapamiento
    - Mensajes de confirmacion

Stack de tecnologia: 
- HTML5
- CSS3 (Nativow).
- JavaScript
- React
- Base de datos y Backend: Supabase

Preferencias generales:
- Todos los textos visibles en la web deben estar en español

Preferencias de diseño:
- Basate en las imagenes del diseño que tienes en la carpeta Design del proyecto

Preferencias de estilos:
- Colores (Los del diseño)
- Use medidas en REM, usando un font-size base de 10px
- Uso de HTML5 y CSS3 nativo.
- Uso de buenas practicas de maquetacion CSS y si es necesario usa flexbox y css grid layout.
- Que la web sea responsive

Preferencias de codigo:
- No añadas dependencias externas.
- HTML debe ser semantico.
- Usa siempre let o const, y no uses nunca var.
- No uses alert, confirm o promt, todo el feedback debe ser visual en el dom.
- Toda alerta o ventana modal que aparezca debe tener el mismo estilo que la web.
- No uses innerHTML, todo el contenido debe ser insertado con appendChild o previamente creando un elemento
- con document.createElement
- Cuidado con olvidar prevenir el default en los eventos submit o click.
- Prioriza el codigo legible y mantenible.
- Prioriza que el codigo sea sencillo de entender (Prioridad alta y comentando detalladamente todo).
- Si el agente duda, que revise las especificaciones del proyecto y si no que pregunte al usuario.

Estructura de archivos: orden de carpetas y archivos
- Claude.md
- Carpeta (Design)
- Estructura de ficheros mas adecuada para proyectos de React (Lo elige el agente de IA)