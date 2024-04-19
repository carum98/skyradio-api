# Create User

## URL
`/users`

## Method
`POST`

## Data Params
| Name | Type | Rules |
| --- | --- | --- |
| name | string | Required |
| email | string | Required |
| password | string | Required, min 6 characters |
| user_role | string | Required, must be one of: `admin`, `user` |

```json
{
    "name": "NAME",
    "email": "EMAIL",
    "password": "PASSWORD",
    "user_role": "ROLE"
}
```