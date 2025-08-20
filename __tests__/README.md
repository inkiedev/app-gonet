# Plan de Pruebas Unitarias - App GoNet

Este directorio contiene las pruebas unitarias basadas en el documento "Pruebas_Unitarias_App_Gonet_Usuario_Final.pdf".

## Estructura de Archivos

```
__tests__/plan/
├── README.md                 # Este archivo
├── jest.config.js           # Configuración Jest específica para el plan
├── setup.js                 # Configuración global de mocks y setup
├── login.test.tsx           # Pruebas del módulo Login (L-01, L-02, L-03)
├── profile.test.tsx         # Pruebas del módulo Perfil (P-01, P-02, P-03)
├── payments.test.tsx        # Pruebas del módulo Pagos (PG-01, PG-02)
├── bot.test.tsx            # Pruebas del módulo Bot (B-01, B-02)
├── agencies.test.tsx       # Pruebas del módulo Agencias (A-01, A-02)
└── session.test.tsx        # Pruebas del módulo Sesión (S-01, S-02, S-03)
```

## Casos de Prueba Implementados

### Login Module (login.test.tsx)
- **L-01**: Acceso con correo y contraseña correctos → Acceso exitoso y redirección al Home
- **L-02**: Acceso con correo inválido → Mensaje "Correo inválido"; acceso bloqueado
- **L-03**: Acceso con contraseña incorrecta → Mensaje "Credenciales incorrectas"; acceso bloqueado

### Profile Module (profile.test.tsx)
- **P-01**: Visualizar datos personales (nombre, correo, cédula) → Datos correctos mostrados en pantalla
- **P-02**: Visualizar planes activos → Lista de planes vigentes con detalles (velocidad, precio)
- **P-03**: Visualizar planes adicionales → Lista de planes disponibles con opción de contratar

### Payments Module (payments.test.tsx)
- **PG-01**: Mostrar facturas ya pagadas → Facturas listadas en sección "Pagadas"
- **PG-02**: Mostrar factura del mes pendiente → Factura visible con monto, fecha de vencimiento y estado "Pendiente"

### Bot Module (bot.test.tsx)
- **B-01**: Iniciar conversación con el chatbot → Mensajes enviados y recibidos correctamente
- **B-02**: Manejo de error en conexión al webhook → Mensaje de error y opción de reintentar

### Agencies Module (agencies.test.tsx)
- **A-01**: Consultar cobertura por ciudad/provincia → Lista de zonas con cobertura disponible
- **A-02**: Mostrar agencias franquiciadas → Información de agencias con dirección y contacto

### Session Module (session.test.tsx)
- **S-01**: Mantener sesión al navegar entre módulos → No solicita login nuevamente; contexto persiste
- **S-02**: Reanudar app desde background → Sesión activa; vuelve al estado previo
- **S-03**: Renovación lógica del token (mock front) → La UI no expulsa al usuario durante la renovación

## Ejecutar las Pruebas

### Ejecutar todas las pruebas del plan:
\`\`\`bash
npm test -- --config=__tests__/plan/jest.config.js
\`\`\`

### Ejecutar pruebas de un módulo específico:
\`\`\`bash
npm test -- __tests__/plan/login.test.tsx
npm test -- __tests__/plan/profile.test.tsx
npm test -- __tests__/plan/payments.test.tsx
npm test -- __tests__/plan/bot.test.tsx
npm test -- __tests__/plan/agencies.test.tsx
npm test -- __tests__/plan/session.test.tsx
\`\`\`

### Ejecutar con coverage:
\`\`\`bash
npm test -- --config=__tests__/plan/jest.config.js --coverage
\`\`\`

## Criterios de Aceptación

- ✅ Todos los casos de prueba de prioridad **Alta** deben aprobarse
- ✅ Los mensajes de error deben ser claros y visibles al usuario
- ✅ No deben existir datos inconsistentes (ejemplo: facturas pendientes listadas como pagadas)
- ✅ La interacción con el chatbot debe ser estable y sin duplicidad de mensajes
- ✅ La sesión se mantiene activa en navegación y reanudación

## Notas

- Se excluyen las pruebas de **Registro** (R-01, R-02, R-03) ya que el módulo no está implementado aún
- Las pruebas utilizan mocks para simular servicios externos y dependencias
- Se incluyen casos de prueba adicionales para manejo de errores y estados de carga
- La configuración Jest está optimizada para React Native y Expo

## Umbrales de Coverage

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%