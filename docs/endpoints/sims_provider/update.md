# Update sims provider

## Role allowed
`admin`

## URL
`/sims-provider/:code`

## Method
`PUT`

## URL Params
| Name | Type | Description |
| --- | --- | --- |
| code | string | Sims provider code |

## Data Params
| Name | Type |
| --- | --- |
| name | string |
| color | string |

```json
{
    "name": "Sims provider name",
    "color": "#000000"
}
```