# Roles

## Description
The API has a role-based access control system. Each role has a set of permissions that allow or deny access to certain endpoints.

## Roles

### `admin`
- Can access all endpoints.
- Unique role that can list, create, update, and delete `users` and `groups`.
- Unique role that can create, update and delete `modalities`, `models`, `status`, `sellers` and `providers`

### `user`
- Can list, create, update and delete `clients`, `radios`, `sims` and `apps`.
- Can generate data reports.

### `guest`
- Can access only get data endpoints.
- Does not have access to any endpoint that changes data.