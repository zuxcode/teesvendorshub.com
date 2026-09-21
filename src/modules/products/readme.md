Yes. For the **ACL (access-control model)**, I would define access around the product lifecycle and ownership rather than around the fields alone.

### Product ACL

| Field          | Public | Admin |                Buyer |
| -------------- | -----: | ----: | -------------------: |
| `name`         |      ✅ |     ✅ |                    ✅ |
| `description`  |      ✅ |     ✅ |                    ✅ |
| `productImage` |      ✅ |     ✅ |                    ✅ |
| `status`       |     ✅* |     ✅ |                    ✅ |
| `price`        |      ✅ |     ✅ |                    ✅ |
| `country`      |      ✅ |     ✅ |                    ✅ |
| `secret`       |      ❌ |     ✅ | ✅ **after delivery** |
| `createdBy`    |      ❌ |     ✅ |                    ❌ |
| `updatedBy`    |      ❌ |     ✅ |                    ❌ |
| `buyer`        |      ❌ |     ✅ |                  ✅** |

* Publicly, I'd expose only products whose status is appropriate for storefront display, typically `available`.

** Whether the buyer needs to read their own `buyer` relationship is optional; it isn't necessary for the storefront.

### Access functions

I'd separate the rules:

```ts
isAdmin
isAdminOrBuyer
isAdminOrDeliveredBuyer
isAdminOnlyFieldAccess
```

For example:

```ts
export const isAdminOrBuyer: FieldAccess = ({ req, doc }) => {
  if (!req.user) {
    return false;
  }

  if (req.user.role === ROLE.ADMIN) {
    return true;
  }

  return req.user.id === getRelationshipId(doc?.buyer);
};
```

Then the sensitive field gets the stricter rule:

```ts
export const isAdminOrDeliveredBuyer: FieldAccess = ({
  req,
  doc,
}) => {
  if (!req.user) {
    return false;
  }

  if (req.user.role === ROLE.ADMIN) {
    return true;
  }

  if (doc?.status !== PRODUCT_STATUS.DELIVERED) {
    return false;
  }

  return req.user.id === getRelationshipId(doc?.buyer);
};
```

Your `secret` then becomes:

```ts
{
  access: {
    create: isAdminOnlyFieldAccess,
    read: isAdminOrDeliveredBuyer,
    update: isAdminOnlyFieldAccess,
  },
  admin: {
    description:
      "Sensitive product information. Visible only to admins and the buyer after delivery.",
  },
  label: "Product Details",
  name: "secret",
  required: true,
  type: "textarea",
}
```

### Lifecycle

The important security boundary becomes:

```text
AVAILABLE
   │
   │ purchase
   ▼
PENDING
   │
   │ payment/fulfillment processing
   ▼
SOLD
   │
   │ delivery confirmed
   ▼
DELIVERED
   │
   └── buyer gains access to secret
```

So **`buyer` identifies who owns the purchase**, while **`status === DELIVERED` determines when the sensitive information becomes readable**.

That's a much cleaner ACL than making `buyer` alone sufficient to expose `secret`.
