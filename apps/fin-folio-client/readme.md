## API & TypeScript Notes

### Index Signatures

- `[key: string]: unknown` lets an interface accept any additional string-keyed properties.
- Use it when you expect extra fields but don’t want TypeScript to infer their shape.

### Axios Error Anatomy

- `axiosError.response`: The server replied with a non-2xx status. Includes `status`, `headers`, and the response body.
- `axiosError.request`: The request was sent but no response arrived (network issues, timeouts).

### REST Verb Cheatsheet

- `GET`: Retrieve existing data without modifying state.
- `POST`: Create new resources or trigger server-side actions.
- `PUT`: Replace the entire resource with a new representation.
- `PATCH`: Apply a partial update; send only the fields that change.
- `DELETE`: Remove the resource.

### PUT vs PATCH

- `PUT` treats omitted fields as missing and often resets them—send the full payload.
  - PUT replaces the resource's entire representation at the target URI.
    Whatever fields you omit are treated as missing and may be reset/removed. Think “complete update.”
- `PATCH` merges provided fields into the existing resource—ideal for targeted edits.
  - PATCH applies a partial update. You send only the fields to change (often in JSON Patch or a custom schema), and the server merges them into the existing resource.

### Utility Types: Pick & Partial

- `Pick<T, K>` creates a type with only the keys listed in `K`. We use it to derive an `AuthUser` subset from the full `User` model:
  - `type AuthUserRequiredFields = Pick<User, "id" | "name" | "email">;`
- `Partial<T>` keeps the same properties but makes them optional. Layering it lets us mark optional profile fields while reusing `User`'s types:
  - `type AuthUserOptionalFields = Partial<Pick<User, "avatarUrl" | "country" | "currency">>;`
- Combining the two keeps auth responses lightweight yet type-safe:
  - `export type AuthUser = AuthUserRequiredFields & AuthUserOptionalFields;`
