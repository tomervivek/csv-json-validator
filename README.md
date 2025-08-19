# Data Processor

A simple Express server for importing and validating JSON and CSV data files. The server validates each record using a schema (id: number, name: string, email: valid email) and returns detailed error messages for invalid data.


## Features

- Upload and validate JSON or CSV files via HTTP POST.
- Schema validation using Joi.
- Detailed error reporting for invalid rows.


## File Structure

- [`server.js`](server.js): Main server code.
- [`Data.json`](Data.json): Example JSON data.
- [`Data.jsv`](Data.jsv): Example CSV data.


## Running the Server

1. Install dependencies:

   npm install

2. Start the server:

   node server.js

3. The server runs at [http://localhost:3000](http://localhost:3000).


## Endpoints

### POST `/import/json`

Upload a JSON file (array of objects) using the `file` field in a multipart/form-data request.


#### Request

- URL: `http://localhost:3000/import/json`
- Form field: `file` (attach your `.json` file)


#### Example Input

```json
[
  { "id": 1, "name": "Alice", "email": "alice@example.com" },
  { "id": 2, "name": "Bob", "email": "bob@example.com" }
]
```


#### Success Response

```json
{
  "message": "JSON data imported successfully!",
  "data": [
    { "id": 1, "name": "Alice", "email": "alice@example.com" },
    { "id": 2, "name": "Bob", "email": "bob@example.com" }
  ]
}
```


#### Example Input

```json
[
  { "id": "abc", "name": "A", "email": "not-an-email" },
  { "id": 2, "name": "", "email": "bob@example.com" },
  { "id": 3, "email": "charlieexample.com" },
  { "name": "Daisy", "email": "daisy@example.com" }
]
```


#### Failure Response

```json
{
  "message": "Validation failed",
  "errors": [
    { "row": 1, "error": "\"id\" must be a number" },
    { "row": 2, "error": "\"name\" is not allowed to be empty" },
    { "row": 3, "error": "\"name\" is required" },
    { "row": 4, "error": "\"id\" is required" }
  ]
}
```


### POST `/import/csv`

Upload a CSV file using the `file` field in a multipart/form-data request. The CSV should have headers: `id,name,email`.

##