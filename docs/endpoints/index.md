# Endpoints
The endpoints of the API are divided into the following categories.

### Auth
- [[POST /login] - Login](./auth/login.md)
- [[POST /refresh-token] - Refresh Token](./auth/refresh-token.md)

### Client
- [[GET /clients] - Get Clients](./clients/get-all.md)
- [[GET /clients/:id] - Get Client](./clients/get-one.md)
- [[POST /clients] - Create Client](./clients/create.md)
- [[PUT /clients/:id] - Update Client](./clients/update.md)
- [[DELETE /clients/:id] - Delete Client](./clients/delete.md)
- [[GET /clients/stats/all] - Get Clients Stats](./clients/stats.md)
- [[GET /clients/:code/radios] - Get Client Radios](./clients/radios.md)
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
- [[GET /radios/:id] - Get Radio](./radios/get-one.md)
- [[POST /radios] - Create Radio](./radios/create.md)
- [[PUT /radios/:id] - Update Radio](./radios/update.md)
- [[DELETE /radios/:id] - Delete Radio](./radios/delete.md)

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
- [[GET /sims] - Get Sims](./radios_sim/get-all.md)
- [[GET /sims/:id] - Get Sim](./radios_sim/get-one.md)
- [[POST /sims] - Create Sim](./radios_sim/create.md)
- [[PUT /sims/:id] - Update Sim](./radios_sim/update.md)
- [[DELETE /sims/:id] - Delete Sim](./radios_sim/delete.md)

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