# CRM Database Setup Guide

## Collections Overview

This CRM system uses MongoDB with the following collections:

### Core Collections

1. **users** - System users (admin, managers, employees)
2. **restaurants** - Restaurant/tenant information
3. **menu_items** - Restaurant menu items with pricing
4. **orders** - Customer orders and transactions
5. **inventory** - Stock management and purchases
6. **employees** - Staff management
7. **suppliers** - Supplier information
8. **sales_reports** - Daily/periodic sales summaries
9. **system_settings** - User preferences and configurations
10. **user_data** - Legacy data storage (backward compatibility)

## Quick Setup

### 1. Run Database Setup
```bash
npm run setup-db
```

### 2. Check Database Connection
```bash
npm run check-db
```

### 3. Test Connection
```bash
npm run test-connection
```

## Default Credentials

After setup, use these credentials to login:
- **Username:** admin
- **Password:** admin123

## Collection Schemas

### Users Collection
```javascript
{
  username: String (unique, required),
  password: String (required, min 6 chars),
  role: String (admin|manager|employee|owner),
  email: String (unique, required),
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Menu Items Collection
```javascript
{
  name: String (required),
  price: Number (required, min 0),
  cost: Number (optional),
  userId: String (required),
  category: String,
  description: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  userId: String (required),
  customerName: String,
  items: Array [{
    id: Number,
    name: String,
    price: Number,
    quantity: Number
  }],
  total: Number (required),
  revenue: Number,
  status: String (Open|Completed|Cancelled),
  paymentMethod: String (cash|card|mobile|other),
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Inventory Collection
```javascript
{
  userId: String (required),
  itemType: String (menu_item|raw_material),
  menuItemId: Number (for menu items),
  rawMaterialName: String (for raw materials),
  quantity: Number (required),
  unitCost: Number (required),
  supplier: String,
  expiryDate: Date,
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Database Functions

### Menu Management
- `saveMenuItem(userId, menuItem)` - Add new menu item
- `getMenuItems(userId)` - Get user's menu items
- `deleteMenuItem(userId, itemId)` - Soft delete menu item

### Order Management
- `saveOrder(userId, orderData)` - Create new order
- `getOrders(userId)` - Get user's orders
- `updateOrderStatus(userId, orderId, status)` - Update order status

### Inventory Management
- `saveInventoryBatch(userId, inventoryData)` - Record purchase
- `getInventory(userId)` - Get inventory batches
- `deleteInventoryBatch(userId, batchId)` - Remove batch

### Employee Management
- `saveEmployee(userId, employeeData)` - Add employee
- `getEmployees(userId)` - Get active employees

### Supplier Management
- `saveSupplier(userId, supplierData)` - Add supplier
- `getSuppliers(userId)` - Get active suppliers

## Indexes

Each collection has optimized indexes for:
- User-specific queries (`userId`)
- Unique constraints (usernames, emails)
- Date-based sorting
- Status filtering
- Performance optimization

## Security Features

- Schema validation for all collections
- Required field enforcement
- Data type validation
- Unique constraints
- Proper indexing for performance

## Troubleshooting

### Connection Issues
1. Check MongoDB URI in environment variables
2. Verify network connectivity
3. Ensure database permissions

### Collection Errors
1. Run `npm run check-db` to verify collections
2. Re-run `npm run setup-db` if needed
3. Check console for specific error messages

### Data Issues
1. Verify user permissions
2. Check data format matches schema
3. Ensure required fields are provided