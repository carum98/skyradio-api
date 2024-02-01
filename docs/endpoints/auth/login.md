# Login

## URL
`/login`

## Method
`POST`

## URL Params
None

## Data Params
| Name | Type | Description |
| --- | --- | --- |
| email | string | User's email |
| password | string | User's password |

```json
{
    "email": "correo@correo.com",
    "password": "123456"
}
```

## Success Response
See [Auth Model](../../response/auth.md)

## Error Response
See [Error Model](../../response/error.md)
