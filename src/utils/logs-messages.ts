export const LOGS_MESSAGES: Record<string, Record<string, string>> = {
    groups: {
        'create-client': 'Nuevo cliente {{ client }}',
        'create-radio': 'Nuevo radio {{ radio }}',
        'create-sim': 'Nuevo sim {{ sim }}',
        'create-app': 'Nueva app {{ app }}',
        'add-radio-to-client': 'Entrega de radio {{ radio }} al cliente {{ client }}',
        'add-app-to-client': 'App {{ app }} relacionado al cliente {{ client }}',
        'add-sim-to-radio': 'Sim {{ sim }} relacionado al radio {{ radio }}',
        'remove-radio-from-client': 'Devolución de radio {{ radio }} del cliente {{ client }}',
        'remove-sim-from-radio': 'Sim {{ sim }} removido del radio {{ radio }}',
        'swap-radio-from-client': 'Cambio de radio',
        'swap-sim-from-radio': 'Cambio de sim',
        'enable-console': 'Consola habilitada en el cliente {{ client }}',
        'disable-console': 'Consola deshabilitada en el cliente {{ client }}'
    },
    radios: {
        'create-radio': 'Radio creado',
        'add-radio-to-client': 'Radio relacionado al cliente {{ client }}',
        'add-sim-to-radio': 'Sim {{ sim }} relacionado al radio',
        'remove-radio-from-client': 'Radio removido del cliente {{ client }}',
        'remove-sim-from-radio': 'Sim {{ sim }} removido del radio',
        'swap-radio-from-client': 'Cambio de radio'
    },
    clients: {
        'create-client': 'Cliente creado',
        'add-radio-to-client': 'Entrega de radio {{ radio }}',
        'remove-radio-from-client': 'Devolución de radio {{ radio }}',
        'swap-radio-from-client': 'Cambio de radio',
        'add-app-to-client': 'App {{ app }} relacionado al cliente',
        'enable-console': 'Consola habilitada',
        'disable-console': 'Consola deshabilitada'
    },
    sims: {
        'create-sim': 'Sim creado',
        'add-sim-to-radio': 'Sim relacionado al radio {{ radio }}',
        'remove-sim-from-radio': 'Sim removido del radio {{ radio }}',
        'swap-sim-from-radio': 'Cambio de sim'
    },
    apps: {
        'create-app': 'App creada',
        'add-app-to-client': 'App relacionado al cliente {{ client }}'
    }
}
