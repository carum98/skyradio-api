# Update User

## Role allowed
`admin`

## URL
`/users/:code`

## Method
`PUT`

## URL Params
| Name | Type | Description |
| --- | --- | --- |
| code | string | User code |

## Data Params
| Name | Type | Rules |
| --- | --- | --- |
| name | string |
| email | string |
| password | string |
| user_role | string |

```json
{
    "name": "NAME",
    "email": "EMAIL",
    "password": "PASSWORD",
    "user_role": "ROLE"
}
```