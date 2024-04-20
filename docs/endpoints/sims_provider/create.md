# Create Sims Provider

## Role allowed
`admin`

## URL
`/sims-provider`

## Method
`POST`

## Data Params
| Name | Type | Rule |
| --- | --- | --- |
| name | string | Required |
| color | string | Required, Format: `#RRGGBB` |

```json
{
    "name": "Sims provider name",
    "color": "#000000"
}
```