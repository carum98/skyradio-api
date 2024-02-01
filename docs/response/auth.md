| Name | Type | Description |
| --- | --- | --- |
| token | string | JWT token |
| refreshToken | string | JWT refresh token |
| expiredAt | number | Token expiration date |
| user | object | User information |
| user.code | string | User's code |
| user.name | string | User's name |
| user.email | string | User's email |
| user.role | string | User's role |
| user.group | object | User's group |
| user.group.id | number | Group's id |
| user.group.name | string | Group's name |

```json
{
    "token": "...",
    "refreshToken": "...",
    "expiredAt": 000000,
    "user": {
        "code": "123456",
        "name": "User Name",
        "email": "correo@correo",
        "role": "admin",
        "group": {
            "id": 1,
            "name": "Group Name"
        }
    }
}
```