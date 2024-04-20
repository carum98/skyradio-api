# Create Modality

## Role allowed
`admin`

## URL
`/clients-modality`

## Method
`POST`

## URL Params
None

## Data Params
| Name | Type | Rule |
| --- | --- | --- |
| name | string | Required |
| color | string | Required, Format: `#RRGGBB` |

```json
{
    "name": "Modality name",
    "color": "#000000"
}
```

## Success Response
See [Client Modality Model](../../response/clients_modality.md)