# Refresh Token

## URL
`/refresh-token`

## Method
`POST`

## URL Params
None

## Data Params
| Name | Type | Description |
| --- | --- | --- |
| refresh-token | string | JWT refresh token |

```json
{
    "refresh-token": "..."
}
```

## Success Response
See [Auth Model](../../response/auth.md)

## Error Response
| Name | Type | Description |
| --- | --- | --- |
| message | string | Error message |

```json
{
    "message": "..."
}
```