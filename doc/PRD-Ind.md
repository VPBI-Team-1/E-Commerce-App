# Product Requirements Document

## Local-First E-Commerce Application

**Document Status:** Draft / Implementation-Ready
**Target:** Local development and local testing
**Architecture:** Modular Monolith
**Primary Language:** TypeScript
**Frontend / Backend Framework:** Next.js with SSR
**Database:** MariaDB
**ORM:** Prisma
**Validation:** Joi
**Forms:** React Hook Form
**UI:** Tailwind CSS + shadcn/ui
**Animation:** Animate UI only where it provides meaningful UX value
**Image Processing:** Sharp
**File Storage:** Local filesystem
**Payment:** Mock Payment Provider
**Deployment:** Local environment first

---

# 1. Product Overview

The application is a full-stack e-commerce platform consisting of:

1. Customer storefront
2. Customer authentication and account management
3. Product catalog
4. Product variants
5. Categories
6. Product search and filtering
7. Shopping cart
8. Checkout
9. Mock payment flow
10. Order management
11. Basic inventory management
12. Wishlist
13. Product reviews
14. Shipping information
15. Promotions/coupons
16. Admin dashboard
17. Basic customer management
18. Basic analytics
19. SEO-friendly storefront pages

The initial implementation must prioritize:

* Correct business logic
* Data consistency
* Server-side validation
* Clear module boundaries
* Simple local development
* Maintainability
* SSR where appropriate
* Minimal infrastructure

The system **must not introduce distributed infrastructure unless explicitly required**.

---

# 2. Goals

## 2.1 Primary Goals

The application must allow a customer to:

* Browse products
* Search products
* Filter and sort products
* View product details
* Select product variants
* Add products to cart
* Update cart quantities
* Proceed to checkout
* Select an address
* Select shipping method
* Apply a coupon
* Create an order
* Complete a simulated payment
* View order status
* View order history
* Review purchased products

The application must allow an administrator to:

* Manage products
* Manage product variants
* Manage categories
* Manage product images
* Manage inventory
* Manage orders
* Manage customers
* Manage coupons
* View basic statistics

---

# 3. Non-Goals

The initial implementation must **not** include:

* Microservices
* Kubernetes
* Redis
* Kafka
* RabbitMQ
* Elasticsearch/OpenSearch
* Cloud object storage
* Real payment gateway
* Real shipping API
* Real-time chat
* Recommendation engine
* AI recommendation system
* Marketplace/multi-vendor functionality
* Multi-warehouse inventory
* Subscription billing
* Loyalty points
* Gift cards
* Advanced promotion engine
* Multi-currency
* Multi-language
* Complex CMS
* Advanced analytics infrastructure

These may be added later if actual requirements justify them.

---

# 4. Technology Stack

| Layer            | Technology                    |
| ---------------- | ----------------------------- |
| Framework        | Next.js                       |
| Language         | TypeScript                    |
| Rendering        | React Server Components + SSR |
| Styling          | Tailwind CSS                  |
| UI Components    | shadcn/ui                     |
| Animation        | Animate UI                    |
| Database         | MariaDB                       |
| ORM              | Prisma                        |
| Validation       | Joi                           |
| Form Management  | React Hook Form               |
| Image Processing | Sharp                         |
| File Storage     | Local filesystem              |
| Payment          | Mock Payment Provider         |
| Testing          | Vitest + Playwright           |
| Database Runtime | Docker Compose                |
| Package Manager  | npm                           |

---

# 5. Architecture

The application must use a **modular monolith**.

```text
                         Browser
                            │
                            ▼
                     ┌─────────────┐
                     │   Next.js   │
                     │             │
                     │ Storefront  │
                     │ Admin       │
                     │ API/Actions │
                     └──────┬──────┘
                            │
                            ▼
                 ┌────────────────────┐
                 │ Application Layer  │
                 │                    │
                 │ Auth               │
                 │ Catalog            │
                 │ Cart               │
                 │ Checkout           │
                 │ Order              │
                 │ Payment            │
                 │ Inventory          │
                 │ Promotion          │
                 └─────────┬──────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Prisma    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   MariaDB   │
                    └─────────────┘
```

External dependencies should be isolated behind interfaces.

Example:

```text
PaymentProvider
    │
    └── MockPaymentProvider
```

Future:

```text
PaymentProvider
    ├── MockPaymentProvider
    └── MidtransProvider
```

The domain/application layer must not depend directly on a specific payment provider.

---

# 6. Project Structure

A recommended structure:

```text
src/
├── app/
│   ├── (storefront)/
│   ├── (admin)/
│   ├── api/
│   └── ...
│
├── modules/
│   ├── auth/
│   ├── user/
│   ├── catalog/
│   ├── category/
│   ├── cart/
│   ├── checkout/
│   ├── order/
│   ├── payment/
│   ├── inventory/
│   ├── promotion/
│   ├── review/
│   ├── wishlist/
│   ├── shipping/
│   └── admin/
│
├── components/
│   ├── ui/
│   └── shared/
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── storage/
│   └── ...
│
├── schemas/
├── types/
└── config/
```

The exact folder structure may be adjusted when implementing, but the following architectural rule is mandatory:

> UI components must not contain complex business logic or direct database operations.

---

# 7. Rendering Strategy

Next.js Server Components should be the default.

## Server Components

Use Server Components for:

* Product listing
* Product detail
* Category pages
* Search result pages
* Order detail
* Admin data pages where interaction is not required
* SEO metadata
* Static content

## Client Components

Use Client Components only where browser-side interaction is required:

* Add-to-cart controls
* Quantity selectors
* Variant selectors
* Image gallery
* Interactive filters
* Dialogs
* Dropdowns requiring client interaction
* Checkout forms
* Payment simulation
* React Hook Form components

Do not make an entire page `"use client"` simply because one child component requires client-side interaction.

---

# 8. Authentication

The application must support:

* Registration
* Login
* Logout
* Password hashing
* Password reset
* Email verification
* Session management
* Customer profile
* Address management
* Role-based authorization

Roles:

```text
CUSTOMER
ADMIN
```

Additional roles should not be introduced unless required.

Authentication state must be enforced server-side.

A hidden admin route is not an authorization mechanism. Humans have been making that mistake since the invention of URLs.

---

# 9. User

User fields:

```text
User
-----
id
email
passwordHash
name
phone
role
emailVerifiedAt
createdAt
updatedAt
```

Requirements:

* Email must be unique.
* Password must never be stored in plain text.
* User role must be validated server-side.
* Users must only access their own private resources.
* Admin-only operations require server-side authorization.

---

# 10. Address

A customer can store multiple addresses.

```text
Address
--------
id
userId
label
recipientName
phone
addressLine
city
province
postalCode
country
isDefault
createdAt
updatedAt
```

Requirements:

* A user can have multiple addresses.
* Only the owner can modify an address.
* Checkout must use a validated address.
* Order data must preserve the address used at checkout.

The order must not depend on the current state of the user's address.

---

# 11. Product Catalog

## Product

```text
Product
-------
id
categoryId
name
slug
description
sku
price
compareAtPrice
status
stock
weight
createdAt
updatedAt
```

Suggested statuses:

```text
DRAFT
ACTIVE
ARCHIVED
```

Requirements:

* `slug` must be unique.
* Product price must be non-negative.
* `compareAtPrice` must not be lower than the selling price when used.
* Archived products must not be purchasable.
* Product data must be validated server-side.

---

# 12. Product Variants

Products may have variants.

Examples:

```text
Size: S / M / L
Color: Black / White
```

Variant:

```text
ProductVariant
--------------
id
productId
sku
name
price
stock
weight
status
createdAt
updatedAt
```

A product may have zero or more variants.

If variants exist, cart items must reference the selected variant.

If a product does not have variants, the cart item may reference the product directly.

SKU must be unique.

---

# 13. Product Images

Images must be stored on the local filesystem.

Example:

```text
storage/
├── products/
│   ├── 01/
│   │   ├── original.webp
│   │   ├── medium.webp
│   │   └── thumbnail.webp
│   └── 02/
└── users/
    └── avatars/
```

Database:

```text
ProductImage
------------
id
productId
variantId nullable
storageKey
altText
sortOrder
createdAt
```

The database must store the file reference, not image binary data.

Example:

```text
products/01/medium.webp
```

Do not store images as MariaDB BLOBs.

---

# 14. Image Upload

The upload flow:

```text
Browser
   ↓
Server
   ↓
Validate MIME type
   ↓
Validate file size
   ↓
Sharp
   ↓
Resize / compress
   ↓
Convert to WebP
   ↓
Local filesystem
   ↓
Save storageKey to DB
```

The server must validate:

* MIME type
* File size
* File extension
* Image dimensions where appropriate

The application must not trust the client-provided filename.

Sharp should be used to normalize uploaded images.

---

# 15. Categories

Categories must support hierarchical relationships.

Example:

```text
Electronics
├── Phones
│   ├── Android
│   └── iPhone
└── Accessories
```

For MVP, maximum recommended depth is 2-3 levels.

Category:

```text
Category
--------
id
parentId nullable
name
slug
description
image
status
createdAt
updatedAt
```

Requirements:

* Slug must be unique.
* Category deletion must not silently orphan products.
* Parent-child relationships must be validated.
* Circular category relationships must be prevented.

---

# 16. Product Listing

The storefront must support:

* Pagination
* Category filtering
* Price filtering
* Availability filtering
* Sorting
* Search

Sorting:

```text
RELEVANCE
PRICE_ASC
PRICE_DESC
NEWEST
```

Pagination should use a simple approach initially.

No Elasticsearch or external search engine is required.

---

# 17. Search

Search must initially use MariaDB-compatible database queries.

Searchable fields:

* Product name
* SKU
* Description where appropriate
* Category name where appropriate

The initial implementation should prioritize correctness over advanced relevance ranking.

No external search infrastructure should be introduced.

---

# 18. Product Detail

Product detail must display:

* Product name
* Images
* Price
* Compare-at price
* Description
* Variants
* Stock availability
* Quantity selector
* Add to cart
* Buy now
* Wishlist
* Reviews
* Related products

Purchase availability must always be determined server-side.

---

# 19. Cart

Cart must support:

* Guest cart
* Authenticated user cart
* Add item
* Remove item
* Update quantity
* Variant selection
* Cart subtotal
* Discount
* Shipping
* Total

Schema:

```text
Cart
----
id
userId nullable
sessionId nullable
createdAt
updatedAt
```

```text
CartItem
--------
id
cartId
productId
variantId nullable
quantity
unitPrice
createdAt
updatedAt
```

Cart ownership must be validated.

---

# 20. Guest Cart

Guest users must be able to add products to cart.

A guest cart is associated with a session identifier.

When the guest logs in:

```text
Guest Cart
     ↓
Authentication
     ↓
Merge Cart
     ↓
User Cart
```

Duplicate products/variants should be merged by increasing quantity rather than creating unnecessary duplicate cart lines.

---

# 21. Cart Price Handling

Cart prices must not be considered authoritative.

At checkout:

```text
Cart
 ↓
Reload product/variant data
 ↓
Validate availability
 ↓
Calculate prices
 ↓
Calculate discounts
 ↓
Calculate shipping
 ↓
Calculate total
 ↓
Create order
```

The server must calculate the final checkout total.

The client must never be trusted for:

* Product price
* Discount amount
* Shipping fee
* Tax amount
* Order total

---

# 22. Checkout

Checkout requires:

1. Cart
2. Customer information
3. Shipping address
4. Shipping method
5. Coupon if applicable
6. Order calculation
7. Payment creation

Flow:

```text
Cart
 ↓
Checkout
 ↓
Validate cart
 ↓
Validate stock
 ↓
Validate address
 ↓
Validate coupon
 ↓
Calculate total
 ↓
Create order
 ↓
Create payment
 ↓
Payment pending
```

Checkout operations must be performed server-side.

---

# 23. Order

Order:

```text
Order
-----
id
orderNumber
userId
status
subtotal
discountAmount
shippingAmount
taxAmount
totalAmount
currency
shippingAddressSnapshot
billingAddressSnapshot
createdAt
updatedAt
```

Order statuses:

```text
PENDING_PAYMENT
PAID
PROCESSING
SHIPPED
DELIVERED
CANCELLED
REFUNDED
```

Order status must not be used as payment status.

---

# 24. Order Items

Order items must store snapshots.

```text
OrderItem
---------
id
orderId
productId nullable
variantId nullable
productName
sku
unitPrice
quantity
totalPrice
```

The application must not rely on current product data to reconstruct historical orders.

For example, if:

```text
Product price = Rp100,000
```

and later becomes:

```text
Product price = Rp150,000
```

an existing order must still display:

```text
Rp100,000
```

---

# 25. Payment

Because the application is local-first, the MVP must use a **Mock Payment Provider**.

No real payment gateway is required.

Architecture:

```text
PaymentService
      ↓
PaymentProvider
      ↓
MockPaymentProvider
```

Future:

```text
PaymentProvider
├── MockPaymentProvider
├── MidtransProvider
└── XenditProvider
```

Production providers must not leak into the domain logic.

---

# 26. Payment Data Model

```text
Payment
-------
id
orderId
provider
providerPaymentId
method
status
amount
currency
paidAt
expiresAt
createdAt
updatedAt
```

Provider:

```text
MOCK
```

Payment methods:

```text
MOCK_CARD
MOCK_BANK_TRANSFER
MOCK_EWALLET
MOCK_QRIS
```

Payment statuses:

```text
PENDING
PAID
FAILED
EXPIRED
REFUNDED
```

---

# 27. Mock Payment Flow

Example:

```text
Checkout
   ↓
Create Order
   ↓
Create Payment
   ↓
PENDING
   ↓
/payment/:paymentId
   ↓
User selects simulated method
   ↓
Simulate Payment
   ↓
PAID
   ↓
Order = PAID
```

The payment page may provide:

```text
[ Simulate Successful Payment ]

[ Simulate Failed Payment ]
```

The simulation must execute server-side.

The browser must not directly modify:

```text
payment.status
order.status
```

because allowing that would be less "payment system" and more "large button labeled free money."

---

# 28. Payment Retry

Failed payments must not be mutated from:

```text
FAILED → PAID
```

Instead:

```text
Order #001

Payment #001 → FAILED
Payment #002 → PENDING
Payment #002 → PAID
```

This preserves payment attempt history.

---

# 29. Payment Expiration

Payments may have:

```text
expiresAt
```

The application can lazily expire pending payments:

```text
if status === PENDING
and expiresAt < currentTime
then status = EXPIRED
```

No cron job or queue is required for MVP.

If a payment needs more sophisticated lifecycle processing later, a scheduler can be introduced.

---

# 30. Payment Events

Payment state changes must be processed idempotently.

A future-compatible event model:

```text
PaymentWebhookEvent
-------------------
id
provider
eventId
eventType
payload
processedAt
createdAt
```

Constraint:

```text
UNIQUE(provider, eventId)
```

The mock provider may simulate webhook-style events internally.

The purpose is architectural compatibility, not unnecessary infrastructure.

---

# 31. Inventory

Inventory must support:

* Current stock
* Stock adjustment
* Stock validation
* Stock deduction
* Out-of-stock state
* Low-stock warning

For MVP, inventory can be stored directly on the product or variant.

```text
Product.stock
ProductVariant.stock
```

An inventory movement table may be added if an audit trail becomes necessary.

Do not create a warehouse management system for a store that does not have warehouses.

---

# 32. Inventory and Payment

For the MVP:

```text
Checkout
 ↓
Check stock
 ↓
Create pending order
 ↓
Payment
 ↓
Payment successful
 ↓
Re-check stock
 ↓
Atomic stock deduction
 ↓
Order = PAID
```

Stock must be revalidated when payment succeeds.

The application must prevent negative stock.

If stock is no longer available:

```text
Payment cannot complete successfully
```

The exact rollback behavior must be transactional.

---

# 33. Shipping

Shipping methods:

```text
ShippingMethod
--------------
id
name
description
fee
estimatedDays
status
createdAt
updatedAt
```

Example:

```text
Regular
Express
Pickup
```

No real courier API is required for MVP.

Shipment:

```text
Shipment
--------
id
orderId
shippingMethodId
trackingNumber nullable
courier nullable
status
shippedAt nullable
deliveredAt nullable
createdAt
updatedAt
```

Shipment status:

```text
PENDING
PROCESSING
SHIPPED
DELIVERED
CANCELLED
```

---

# 34. Promotions and Coupons

MVP supports basic coupons.

Coupon:

```text
Coupon
------
id
code
type
value
minimumOrderAmount
maximumDiscount nullable
usageLimit nullable
usedCount
startsAt
expiresAt
status
createdAt
updatedAt
```

Types:

```text
PERCENTAGE
FIXED_AMOUNT
FREE_SHIPPING
```

Rules must be evaluated server-side.

Client-provided discount amounts must never be trusted.

---

# 35. Coupon Redemption

Track coupon usage:

```text
CouponRedemption
----------------
id
couponId
userId
orderId
createdAt
```

Prevent duplicate redemption where business rules require it.

Coupon validation must check:

* Code exists
* Active status
* Start date
* Expiration date
* Minimum order
* Usage limit
* User eligibility
* Existing redemption

---

# 36. Wishlist

Authenticated customers can:

* Add product
* Remove product
* View wishlist

Schema:

```text
Wishlist
--------
id
userId
createdAt
updatedAt
```

```text
WishlistItem
------------
id
wishlistId
productId
createdAt
```

Unique constraint:

```text
UNIQUE(wishlistId, productId)
```

---

# 37. Reviews

Customers can review purchased products.

Review:

```text
Review
------
id
userId
productId
orderId nullable
rating
title
content
status
createdAt
updatedAt
```

Rating:

```text
1 - 5
```

Recommended statuses:

```text
PENDING
APPROVED
REJECTED
```

A review should only be submitted for products the user purchased if the application implements verified-purchase reviews.

---

# 38. Admin Dashboard

Admin functionality:

### Products

* Create
* Read
* Update
* Archive
* Manage variants
* Upload images
* Manage stock

### Categories

* Create
* Update
* Delete/archive
* Reorder if needed

### Orders

* View
* Filter
* View details
* Update fulfillment status
* View payment status

### Customers

* View customers
* View customer orders
* View customer profile

### Coupons

* Create
* Update
* Disable
* View usage

---

# 39. Admin Authorization

Admin authorization must be enforced on the server.

Every admin mutation must verify:

```text
authenticated user
+
role === ADMIN
```

UI hiding is not sufficient.

For example:

```text
POST /api/admin/products
```

must reject unauthorized users even if they manually call the endpoint.

---

# 40. Validation Architecture

The project uses Joi exclusively for application input validation.

Flow:

```text
Client
 ↓
React Hook Form
 ↓
Joi
 ↓
Server Action / Route Handler
 ↓
Joi
 ↓
Application Service
 ↓
Prisma
 ↓
MariaDB
```

Client validation improves UX.

Server validation is mandatory.

Database constraints provide final integrity guarantees.

These are three different layers and must not be conflated.

---

# 41. Validation Rules

Example:

```text
quantity
→ integer
→ minimum 1
```

Joi validates:

```text
quantity: Joi.number().integer().min(1).required()
```

The service then checks:

```text
quantity <= availableStock
```

MariaDB then enforces applicable database constraints.

Joi cannot determine every business rule.

For example:

```text
Joi:
quantity = 3
```

does not mean:

```text
stock >= 3
```

Stock availability is business logic.

---

# 42. Environment Validation

Environment variables must be validated at application startup.

Examples:

```text
DATABASE_URL
NEXT_PUBLIC_APP_URL
SESSION_SECRET
STORAGE_PATH
```

Invalid configuration should cause startup failure.

Do not silently fall back to unsafe defaults for secrets.

---

# 43. Database

MariaDB should run through Docker Compose.

Example:

```text
docker-compose.yml
```

Services:

```text
mariadb
```

Only required infrastructure should be included.

Next.js can run natively:

```bash
npm run dev
```

Database:

```bash
docker compose up -d
```

---

# 44. Prisma

Prisma is the only ORM/data access layer.

Application code should not contain arbitrary SQL unless Prisma cannot reasonably express a required query.

Database access should be encapsulated by module services/repositories where useful.

Do not create repositories for every single table merely to satisfy architectural cosplay.

Use abstractions where they provide actual value.

---

# 45. Transactions

Database transactions must be used for operations where multiple records must remain consistent.

Examples:

### Checkout

```text
Create Order
Create Order Items
Create Payment
```

### Successful Payment

```text
Update Payment
Deduct Inventory
Update Order
```

### Cart Merge

```text
Merge Cart Items
Delete Guest Cart
```

### Coupon Redemption

```text
Create Order
Create Redemption
Update usage
```

Exact transaction boundaries should be determined based on actual database operations.

---

# 46. Concurrency

Inventory updates must be safe against concurrent requests.

Example:

```text
Stock = 2

Customer A buys 2
Customer B buys 1
```

The system must not allow:

```text
Stock = -1
```

Stock deduction must be performed atomically or inside an appropriate transaction.

Do not rely on:

```text
if (stock >= quantity) {
   stock -= quantity
}
```

as a standalone application-level check without concurrency protection.

---

# 47. Caching

Cache only data that can safely become temporarily stale.

Potentially cacheable:

* Category data
* Product descriptions
* Static pages
* Related products
* SEO metadata
* Public catalog content

Must not rely on stale cache for:

* Inventory
* Cart
* Checkout totals
* Payment status
* Order status
* User account information

Whenever product price or availability changes, relevant storefront cache/revalidation behavior must be considered.

---

# 48. SEO

Public storefront pages should support:

* Server rendering
* Metadata
* Dynamic page titles
* Descriptions
* Canonical URLs where required
* Product structured data where useful
* SEO-friendly slugs

Primary SEO pages:

```text
/
/products
/products/[slug]
/categories/[slug]
```

Admin pages do not need SEO optimization.

---

# 49. UI System

The application must use:

```text
Tailwind CSS
+
shadcn/ui
```

shadcn/ui should provide foundational components such as:

* Button
* Input
* Select
* Dialog
* Dropdown
* Table
* Card
* Tabs
* Form
* Toast
* Alert
* Sheet

Application-specific components should be composed from these primitives.

Do not install another UI library for the same purpose unless there is a concrete requirement.

---

# 50. Animate UI

Animate UI may be used for:

* Page transitions
* Modal transitions
* Dropdown animations
* Cart feedback
* Loading states
* Product interaction feedback
* Empty-state transitions

Animation must not interfere with:

* Accessibility
* Form submission
* Navigation
* Server rendering
* Performance

Do not animate every element merely because the dependency exists.

---

# 51. Responsive Design

The storefront must support:

* Mobile
* Tablet
* Desktop

Priority:

```text
Mobile → Tablet → Desktop
```

Admin can prioritize desktop but should remain usable on smaller screens.

---

# 52. Error Handling

The application must distinguish:

### Validation error

Example:

```text
Invalid email
```

### Business error

Example:

```text
Product is out of stock
```

### Authorization error

```text
Unauthorized
```

### Not found

```text
Product not found
```

### Internal error

```text
Unexpected server error
```

Internal errors must not expose:

* Database queries
* Stack traces
* Secrets
* Internal implementation details

to the client.

---

# 53. API / Server Actions

Next.js Server Actions may be used where appropriate for internal application mutations.

Route Handlers should be used when an HTTP API is actually required.

Do not create API endpoints for every operation merely because REST exists.

Internal server-side operations can use application services directly.

External integrations should use explicit interfaces.

---

# 54. Security Requirements

The application must:

* Hash passwords securely
* Use secure session handling
* Validate all server input
* Enforce authorization server-side
* Prevent unauthorized object access
* Validate uploaded files
* Prevent SQL injection through Prisma/query parameterization
* Escape/sanitize user-generated content where rendered as HTML
* Protect sensitive cookies
* Avoid exposing secrets to client-side bundles
* Verify payment events
* Apply rate limiting where authentication/security requires it

Security-sensitive operations must not depend solely on client-side checks.

---

# 55. File Storage Abstraction

Local storage should be abstracted.

```text
StorageService
├── upload()
├── delete()
├── exists()
└── getUrl()
```

Implementation:

```text
LocalStorage
```

Future:

```text
S3Storage
```

The rest of the application should depend on:

```text
StorageService
```

rather than directly manipulating filesystem paths.

---

# 56. Email

For local development, email should not depend on a production email provider.

A local mail catcher such as Mailpit can be used if email flows need to be tested.

Required email scenarios:

* Email verification
* Password reset
* Order confirmation

The email service should be abstracted:

```text
EmailService
```

Local implementation:

```text
LocalEmailService
```

No production email provider is required for MVP.

---

# 57. Notifications

MVP can use:

* In-app notifications where useful
* Email through local development mail service

Do not introduce:

* Push notification infrastructure
* WebSockets
* Kafka
* Message queues

unless actual requirements require them.

---

# 58. Analytics

Basic analytics can be implemented using database queries.

Examples:

* Total orders
* Revenue
* Orders by status
* Top products
* Low-stock products
* Customer count

No analytics warehouse is required.

Admin dashboard queries must be reasonably optimized but do not require a separate analytics system.

---

# 59. Logging

Application logs should include useful operational information.

Examples:

```text
INFO
WARN
ERROR
```

Important events:

* Authentication failure
* Payment failure
* Order creation
* Inventory failure
* Admin mutation
* Unexpected server error

Sensitive information must not be logged.

Do not log:

```text
password
session secret
payment credentials
full sensitive payloads
```

---

# 60. Audit Logs

Admin audit logs are recommended for important mutations.

Example:

```text
AuditLog
--------
id
userId
action
entityType
entityId
metadata
createdAt
```

Examples:

```text
PRODUCT_CREATED
PRODUCT_UPDATED
PRODUCT_ARCHIVED
ORDER_STATUS_UPDATED
COUPON_CREATED
```

This can initially be limited to high-impact admin actions.

---

# 61. Testing

## Unit Tests

Use Vitest for:

* Price calculation
* Discount calculation
* Coupon validation
* Cart calculations
* Order calculations
* Payment state transitions
* Inventory rules

## Integration Tests

Test:

* Checkout
* Order creation
* Payment success
* Payment failure
* Inventory deduction
* Coupon redemption

## E2E Tests

Use Playwright for critical flows:

```text
Register
 ↓
Login
 ↓
Browse product
 ↓
Add to cart
 ↓
Checkout
 ↓
Mock payment
 ↓
View order
```

Admin:

```text
Login as admin
 ↓
Create product
 ↓
Update stock
 ↓
View order
```

---

# 62. Core Business Rules

The following rules are mandatory.

### Product

* Archived products cannot be purchased.
* Product SKU must be unique.
* Variant SKU must be unique.
* Price cannot be negative.

### Cart

* Quantity must be positive.
* Cart ownership must be verified.
* Cart prices are not authoritative.

### Checkout

* Server calculates totals.
* Server validates stock.
* Server validates coupon.
* Server validates address.
* Client totals are never trusted.

### Payment

* Payment is created separately from order.
* Payment status is separate from order status.
* Failed payment attempts are immutable.
* Payment events must be idempotent.
* Payment success must be processed server-side.

### Inventory

* Stock cannot become negative.
* Inventory must be revalidated before deduction.
* Inventory deduction must be concurrency-safe.

### Order

* Order stores product/price snapshots.
* Historical order data must not change when catalog data changes.

### Authorization

* Customers can only access their own resources.
* Admin operations require ADMIN role.
* Authorization must be enforced server-side.

---

# 63. Database Model Overview

Initial Prisma schema should approximately contain:

```text
User
Address

Category
Product
ProductVariant
ProductImage

Cart
CartItem

Order
OrderItem

Payment
PaymentWebhookEvent

ShippingMethod
Shipment

Coupon
CouponRedemption

Wishlist
WishlistItem

Review

AuditLog
```

Potentially later:

```text
InventoryMovement
Notification
```

Do not add tables without a corresponding requirement.

---

# 64. MVP Scope

## P0

The first implementation must include:

### Authentication

* Register
* Login
* Logout
* Session
* Password hashing
* Basic role authorization

### Catalog

* Product CRUD
* Product variants
* Categories
* Product images
* Product listing
* Product detail
* Search
* Basic filtering

### Cart

* Guest cart
* User cart
* Add/remove/update
* Cart merge

### Checkout

* Address
* Shipping method
* Price calculation
* Basic coupon
* Order creation

### Payment

* Mock payment provider
* Payment page
* Successful payment
* Failed payment
* Payment expiration
* Payment retry

### Order

* Order history
* Order detail
* Order status
* Payment status

### Inventory

* Stock
* Stock validation
* Stock deduction

### Admin

* Product management
* Category management
* Order management
* Basic customer view

---

# 65. P1 Scope

After P0 is stable:

* Wishlist
* Reviews
* Coupon management UI
* Shipping tracking
* Email notifications
* Customer management
* Basic analytics
* SEO improvements
* Audit logs
* Better product filtering

---

# 66. P2 Scope

Only implement if product requirements justify them:

* Recommendations
* Advanced search
* Flash sales
* Loyalty points
* Gift cards
* Abandoned cart
* Multiple warehouses
* Multi-currency
* Multi-language
* Marketplace
* Subscription
* Advanced promotion engine
* Advanced analytics
* Real payment gateway
* Real courier integrations

---

# 67. Important AI Agent Constraints

The coding agent must follow these rules.

## Rule 1: Do not invent requirements

If a behavior is not defined in this PRD:

1. Prefer the simplest reasonable implementation.
2. Do not introduce infrastructure solely to support hypothetical future requirements.
3. Do not invent complex business rules.

---

## Rule 2: Do not over-engineer

Do not add:

```text
Redis
Kafka
RabbitMQ
Elasticsearch
Microservices
CQRS
Event sourcing
Kubernetes
GraphQL
Separate backend service
```

unless explicitly requested.

---

## Rule 3: Preserve module boundaries

Business logic should be located inside the appropriate module.

Example:

```text
modules/payment/payment.service.ts
```

should contain payment business logic.

A React component should not:

```text
validate payment
update database
change order status
deduct inventory
```

all in one file.

---

## Rule 4: Never trust client calculations

The client may display:

```text
total = 100000
```

but the server must recalculate it.

The same applies to:

* Price
* Discount
* Shipping
* Tax
* Stock
* Payment status
* Order status

---

## Rule 5: Server is authoritative

The server is authoritative for:

```text
Authentication
Authorization
Pricing
Inventory
Checkout
Payment
Orders
Coupons
```

---

## Rule 6: Database integrity matters

Use:

* Foreign keys
* Unique constraints
* Appropriate indexes
* Transactions
* Non-null constraints
* Appropriate data types

Do not rely exclusively on TypeScript or Joi to maintain database integrity.

---

# 68. Indexing Requirements

At minimum, indexes should exist for frequently queried fields.

Examples:

```text
User.email UNIQUE

Product.slug UNIQUE
Product.sku UNIQUE

Product.categoryId
Product.status

ProductVariant.productId
ProductVariant.sku UNIQUE

Cart.userId
Cart.sessionId

CartItem.cartId

Order.userId
Order.orderNumber UNIQUE
Order.status

OrderItem.orderId

Payment.orderId
Payment.providerPaymentId

Coupon.code UNIQUE
CouponRedemption.couponId
CouponRedemption.userId
```

Exact indexing should follow actual Prisma queries.

Do not create dozens of indexes preemptively.

---

# 69. Currency

For MVP, use:

```text
IDR
```

Money values must not use floating-point arithmetic.

Prefer integer minor units where applicable.

For Indonesian Rupiah, because there are no fractional rupiah in normal application pricing:

```text
499000
```

represents:

```text
Rp499.000
```

Database and application calculations must be consistent.

---

# 70. Dates

Store timestamps consistently.

Recommended:

```text
UTC
```

Convert to local timezone only for presentation.

Do not mix arbitrary server-local timestamps with UTC timestamps.

---

# 71. Slugs

Public resources should use slugs where appropriate.

Example:

```text
/products/iphone-17-pro
/categories/smartphones
```

Slug generation must handle:

* Duplicate names
* Special characters
* Updates
* Existing slugs

Slug uniqueness must be enforced by the database.

---

# 72. UX Requirements

The application must provide:

* Loading states
* Empty states
* Error states
* Success feedback
* Disabled states during mutations
* Form validation messages
* Confirmation dialogs for destructive admin operations

Forms must avoid submitting multiple identical requests accidentally.

Animations must remain secondary to usability.

---

# 73. Accessibility

UI should follow basic accessibility requirements:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Labels for form inputs
* Accessible dialogs
* Accessible buttons
* Sufficient contrast
* Appropriate ARIA only when semantic HTML is insufficient

shadcn/ui components should be preferred where they already solve accessibility concerns.

---

# 74. Performance

Initial performance priorities:

1. Server rendering
2. Optimized images
3. Minimal client JavaScript
4. Database query efficiency
5. Pagination
6. Avoid unnecessary re-renders
7. Avoid unnecessarily large dependencies

Use Next.js image optimization where appropriate.

Use Sharp for uploaded image processing.

Do not optimize hypothetical bottlenecks before they exist.

---

# 75. Local Development

Expected developer workflow:

```bash
npm install

docker compose up -d

npx prisma migrate dev

npm run dev
```

Optional seed:

```bash
npx prisma db seed
```

Seed data should provide enough data to test:

* Products
* Categories
* Variants
* Users
* Admin
* Orders
* Coupons

Development credentials must never be reused for production.

---

# 76. Environment

Example:

```text
DATABASE_URL=
NEXT_PUBLIC_APP_URL=
SESSION_SECRET=
STORAGE_PATH=
```

Development:

```text
STORAGE_PATH=./storage
```

The `.env` file must not be committed if it contains secrets.

Provide:

```text
.env.example
```

with placeholders.

---

# 77. Definition of Done

A feature is considered complete only when:

* UI exists where required
* Server-side validation exists
* Authorization exists where required
* Business logic is implemented in the appropriate module
* Database constraints exist
* Error handling exists
* Loading/empty/error states exist
* Relevant tests exist
* No secrets are exposed
* No direct client-side mutation of authoritative state exists

For critical flows, E2E testing is required.

---

# 78. Critical E2E Acceptance Flow

The following flow must work from a clean local environment:

```text
1. Open storefront
2. Browse category
3. Search product
4. Open product detail
5. Select variant
6. Add product to cart
7. Open cart
8. Change quantity
9. Login/register
10. Merge guest cart
11. Select address
12. Select shipping method
13. Apply valid coupon
14. Review calculated total
15. Create order
16. Open payment page
17. Simulate successful payment
18. Verify payment = PAID
19. Verify order = PAID
20. Verify inventory decreased
21. Open order history
22. Open order detail
```

Failure flow:

```text
Create order
 ↓
Payment
 ↓
Simulate failure
 ↓
Payment = FAILED
 ↓
Order remains unpaid
 ↓
Create new payment attempt
 ↓
Simulate success
 ↓
Payment = PAID
 ↓
Order = PAID
```

---

# 79. Implementation Priority

AI agent should implement in this order:

```text
Phase 1
├── Project setup
├── MariaDB
├── Prisma
├── Authentication
└── Base UI

Phase 2
├── Category
├── Product
├── Product Variant
└── Product Image

Phase 3
├── Product listing
├── Search
├── Product detail
└── Filters

Phase 4
├── Cart
├── Guest cart
└── Cart merge

Phase 5
├── Address
├── Shipping
├── Checkout calculation
└── Order creation

Phase 6
├── PaymentProvider
├── MockPaymentProvider
├── Payment page
├── Payment success
├── Payment failure
└── Payment retry

Phase 7
├── Inventory
├── Inventory concurrency handling
└── Order/payment state transitions

Phase 8
├── Admin products
├── Admin categories
├── Admin orders
└── Admin customers

Phase 9
├── Coupons
├── Wishlist
├── Reviews
└── Email

Phase 10
├── Testing
├── SEO
├── Performance
└── Final UX polish
```

---

# 80. Final Architecture Rule

The implementation should remain approximately:

```text
Next.js
│
├── Storefront
├── Admin
├── Server Actions / Route Handlers
│
├── Modules
│   ├── Auth
│   ├── Catalog
│   ├── Cart
│   ├── Checkout
│   ├── Order
│   ├── Payment
│   ├── Inventory
│   ├── Promotion
│   ├── Review
│   └── Wishlist
│
├── Prisma
│
└── MariaDB
```

With adapters:

```text
StorageService
└── LocalStorage

PaymentProvider
└── MockPaymentProvider

EmailService
└── LocalEmailService
```

The architecture is intentionally boring.

That is a feature.