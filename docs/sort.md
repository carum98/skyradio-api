# Sort

## Introduction
The sort is used in paginated endpoints, to provide a way to sort the data. The sort is passed as query parameters in the URL. The sort is applied directly to the database query, so it is very efficient.

## Syntax
The sort is passed as query parameters in the URL. The syntax is `?sort_by=name&sort_order=asc`. Where `sort_by` is the name of the field to sort by, and `sort_order` is the order of the sort (`asc` for ascending and `desc` for descending).

## Parameters
The following parameters are available:
- **sort_by**: The name of the field to sort by.
- **sort_order**: The order of the sort. The possible values are `asc` for ascending and `desc` for descending. If the sort_order is not provided, the default value is `asc`.

## Examples
- Get all clients sorted by name in ascending order: `?sort_by=name&sort_order=asc`.
- Get all radios sorted by name in descending order: `?sort_by=name&sort_order=desc`.