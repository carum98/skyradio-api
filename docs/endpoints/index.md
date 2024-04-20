# Endpoints
The endpoints of the API are divided into the following categories.

### Auth
- [[POST /login] - Login](./auth/login.md)
- [[POST /refresh-token] - Refresh Token](./auth/refresh-token.md)

### User
- [[GET /users] - Get Users](./users/get-all.md)
- [[GET /users/:code] - Get User](./users/get-one.md)
- [[POST /users] - Create User](./users/create.md)
- [[PUT /users/:code] - Update User](./users/update.md)
- [[DELETE /users/:code] - Delete User](./users/delete.md)

### Client
- [[GET /clients] - Get Clients](./clients/get-all.md)
- [[GET /clients/:code] - Get Client](./clients/get-one.md)
- [[POST /clients] - Create Client](./clients/create.md)
- [[PUT /clients/:code] - Update Client](./clients/update.md)
- [[DELETE /clients/:code] - Delete Client](./clients/delete.md)
- [[GET /clients/:code/logs] - Get Client Logs](./clients/logs.md)
- [[GET /clients/stats/all] - Get Clients Stats](./clients/stats.md)
- [[GET /clients/:code/radios] - Get Client Radios](./clients/radios.md)
- [[POST /clients/:code/radios] - Set Client Radios](./clients/set-radios.md)
- [[DELETE /clients/:code/radios] - Remove Radios](./clients/remove-radios.md)
- [[PUT /clients/:code/radios] - Swap Radios](./clients/swap-radios.md)
- [[GET /clients/:code/console] - Get Client Console](./clients/console.md)
- [[POST /clients/:code/console] - Set Client Console](./clients/set-console.md)
- [[GET /clients/:code/apps] - Get Client Apps](./clients/apps.md)
- [[POST /clients/:code/apps] - Set Client App](./clients/set-app.md)

### Modality
- [[GET /modalities] - Get Modalities](./clients_modality/get-all.md)
- [[GET /modalities/:id] - Get Modality](./clients_modality/get-one.md)
- [[POST /modalities] - Create Modality](./clients_modality/create.md)
- [[PUT /modalities/:id] - Update Modality](./clients_modality/update.md)
- [[DELETE /modalities/:id] - Delete Modality](./clients_modality/delete.md)

### Seller
- [[GET /sellers] - Get Sellers](./clients_seller/get-all.md)
- [[GET /sellers/:id] - Get Seller](./clients_seller/get-one.md)
- [[POST /sellers] - Create Seller](./clients_seller/create.md)
- [[PUT /sellers/:id] - Update Seller](./clients_seller/update.md)
- [[DELETE /sellers/:id] - Delete Seller](./clients_seller/delete.md)

### Radios
- [[GET /radios] - Get Radios](./radios/get-all.md)
- [[GET /radios/:code] - Get Radio](./radios/get-one.md)
- [[POST /radios] - Create Radio](./radios/create.md)
- [[PUT /radios/:code] - Update Radio](./radios/update.md)
- [[DELETE /radios/:code] - Delete Radio](./radios/delete.md)
- [[GET /radios/:code/clients] - Get Radio Clients](./radios/clients.md)
- [[POST /radios/:code/clients] - Set Radio Clients](./radios/set-client.md)
- [[DELETE /radios/:code/clients] - Remove Clients](./radios/remove-clients.md)
- [[GET /radios/:code/sim] - Get Radio Sim](./radios/sim.md)
- [[POST /radios/:code/sim] - Set Radio Sim](./radios/set-sim.md)
- [[DELETE /radios/:code/sim] - Remove Sim](./radios/remove-sim.md)

### Model
- [[GET /models] - Get Models](./radios_model/get-all.md)
- [[GET /models/:id] - Get Model](./radios_model/get-one.md)
- [[POST /models] - Create Model](./radios_model/create.md)
- [[PUT /models/:id] - Update Model](./radios_model/update.md)
- [[DELETE /models/:id] - Delete Model](./radios_model/delete.md)

### Status
- [[GET /status] - Get Status](./radios_status/get-all.md)
- [[GET /status/:id] - Get Status](./radios_status/get-one.md)
- [[POST /status] - Create Status](./radios_status/create.md)
- [[PUT /status/:id] - Update Status](./radios_status/update.md)
- [[DELETE /status/:id] - Delete Status](./radios_status/delete.md)

### Sims
- [[GET /sims] - Get Sims](./sims/get-all.md)
- [[GET /sims/:code] - Get Sim](./sims/get-one.md)
- [[POST /sims] - Create Sim](./sims/create.md)
- [[PUT /sims/:code] - Update Sim](./sims/update.md)
- [[DELETE /sims/:code] - Delete Sim](./sims/delete.md)
- [[GET /sims/:code/radios] - Get Radio](./sims/radios.md)
- [[POST /sims/:code/radios] - Set Radio](./sims/set-radio.md)
- [[DELETE /sims/:code/radios] - Remove Radio](./sims/remove-radio.md)

### Provider
- [[GET /providers] - Get Providers](./radios_provider/get-all.md)
- [[GET /providers/:id] - Get Provider](./radios_provider/get-one.md)
- [[POST /providers] - Create Provider](./radios_provider/create.md)
- [[PUT /providers/:id] - Update Provider](./radios_provider/update.md)
- [[DELETE /providers/:id] - Delete Provider](./radios_provider/delete.md)

### License
- [[GET /licenses] - Get Licenses](./licenses/get-all.md)
- [[GET /licenses/:code] - Get License](./licenses/get-one.md)
- [[POST /licenses] - Create License](./licenses/create.md)
- [[PUT /licenses/:code] - Update License](./licenses/update.md)
- [[DELETE /licenses/:code] - Delete License](./licenses/delete.md)

### Console
- [[GET /consoles] - Get Consoles](./consoles/get-all.md)
- [[GET /consoles/:code] - Get Console](./consoles/get-one.md)
- [[POST /consoles] - Create Console](./consoles/create.md)
- [[PUT /consoles/:code] - Update Console](./consoles/update.md)

### Apps
- [[GET /apps] - Get Apps](./apps/get-all.md)
- [[GET /apps/:code] - Get App](./apps/get-one.md)
- [[POST /apps] - Create App](./apps/create.md)
- [[PUT /apps/:code] - Update App](./apps/update.md)
- [[DELETE /apps/:code] - Delete App](./apps/delete.md)