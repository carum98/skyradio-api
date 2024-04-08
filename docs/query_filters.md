# Query filters

## Introduction
The query filters are used in paginated endpoints, to provide a way to get data that matches certain criteria. The filters are passed as query parameters in the URL. The filters are applied directly to the database query, so they are very efficient, but need to know the database schema to be used correctly.

## Syntax
The filters are passed as query parameters in the URL. The syntax is `?name[condition]=value`. If you want to pass multiple values for the same filter, you can use a comma-separated list, like this: `?name[condition]=value1,value2,value3`. Where `name` is the name of the field in the database, `condition` is the condition to apply to the filter, and `filter_value` is the value to filter by. To apply filters to related models, you can use square brackets before the condition, like this: `?name[key][condition]=value`.

## Conditions
The following conditions are available:
- **equal**: The field must be equal to the value. Example: `?name[equal]=value`.

- **not_equal**: The field must not be equal to the value. Example: `?name[not_equal]=value`.

- **like**: The field must be like the value. Example: `?name[like]=value`.

- **is_null**: The field must be null. Example: `?name[is_null]`.

- **is_not_null**: The field must not be null. Example: `?name[is_not_null]`.

- **in**: The field must be in the list of values. Example: `?name[in]=value1,value2,value3`.

- **not_in**: The field must not be in the list of values. Example: `?name[not_in]=value1,value2,value3`.

## Examples
- Get all clients from one specific seller: `?sellers[code][equal]=b0w64z`.

- Get all radios that are related to a client and must not be deleted: `?client[code][is_not_null]&client[deleted_at][is_null]`.