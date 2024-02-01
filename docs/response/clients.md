| Field | Type | Description |
| --- | --- | --- |
| code | string | Client's code |
| name | string | Client's name |
| color | string | Client's color |
| modality | object | Client's modality |
| modality.code | string | Modality's code |
| modality.name | string | Modality's name |
| modality.color | string | Modality's color |
| seller | object | Client's seller |
| seller.code | string | Seller's code |
| seller.name | string | Seller's name |
| radios_count | number | Client's radios count |

```json
{
    "code": "...",
    "name": "...",
    "color": "#...",
    "modality": {
        "code": "...",
        "name": "...",
        "color": "#..."
    },
    "seller": {
        "code": "...",
        "name": "..."
    },
    "radios_count": 0
}
```