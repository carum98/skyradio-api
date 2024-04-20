# Create Status

## Role allowed
`admin`

## URL
`/radios-status`

## Method
`POST`

## Data Params
| Name | Type | Rule |
| --- | --- | --- |
| name | string | Required |
| color | string | Required, Format: `#RRGGBB` |

```json
{
    "name": "Status name",
    "color": "#000000"
}
```