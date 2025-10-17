import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://amrofagiri24_db_user:MdrB73OPBKyM2urc@cluster0.s8me4tw.mongodb.net/?retryWrites=true&w=majority';

async function setupCollections() {
  const client = new MongoClient(uri);

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('✅ Connected successfully');
    
    const db = client.db('crm_database');
    
    // Collections to create
    const collections = [
      {
        name: 'users',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['username', 'password', 'role', 'email'],
            properties: {
              username: { bsonType: 'string', minLength: 3 },
              password: { bsonType: 'string', minLength: 6 },
              role: { enum: ['admin', 'manager', 'employee', 'owner'] },
              email: { bsonType: 'string', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
              phone: { bsonType: 'string' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        },
        indexes: [
          { key: { username: 1 }, unique: true },
          { key: { email: 1 }, unique: true }
        ]
      },
      {
        name: 'restaurants',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['tenantId', 'name'],
            properties: {
              tenantId: { bsonType: 'string' },
              name: { bsonType: 'string', minLength: 2 },
              address: { bsonType: 'string' },
              phone: { bsonType: 'string' },
              email: { bsonType: 'string' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        },
        indexes: [
          { key: { tenantId: 1 }, unique: true }
        ]
      },
      {
        name: 'menu_items',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'price', 'userId'],
            properties: {
              name: { bsonType: 'string', minLength: 2 },
              price: { bsonType: 'number', minimum: 0 },
              cost: { bsonType: 'number', minimum: 0 },
              userId: { bsonType: 'string' },
              category: { bsonType: 'string' },
              description: { bsonType: 'string' },
              isActive: { bsonType: 'bool' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        },
        indexes: [
          { key: { userId: 1 } },
          { key: { name: 1, userId: 1 } },
          { key: { category: 1 } }
        ]
      },
      {
        name: 'orders',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['userId', 'items', 'total', 'status'],
            properties: {
              userId: { bsonType: 'string' },
              customerName: { bsonType: 'string' },
              items: {
                bsonType: 'array',
                items: {
                  bsonType: 'object',
                  required: ['id', 'name', 'price', 'quantity'],
                  properties: {
                    id: { bsonType: 'number' },
                    name: { bsonType: 'string' },
                    price: { bsonType: 'number' },
                    quantity: { bsonType: 'number', minimum: 1 }
                  }
                }
              },
              total: { bsonType: 'number', minimum: 0 },
              revenue: { bsonType: 'number', minimum: 0 },
              status: { enum: ['Open', 'Completed', 'Cancelled'] },
              paymentMethod: { enum: ['cash', 'card', 'mobile', 'other'] },
              date: { bsonType: 'date' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        },
        indexes: [
          { key: { userId: 1 } },
          { key: { status: 1 } },
          { key: { date: -1 } },
          { key: { userId: 1, status: 1 } }
        ]
      },
      {
        name: 'inventory',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['userId', 'itemType', 'quantity', 'unitCost'],
            properties: {
              userId: { bsonType: 'string' },
              itemType: { enum: ['menu_item', 'raw_material'] },
              menuItemId: { bsonType: 'number' },
              rawMaterialName: { bsonType: 'string' },
              quantity: { bsonType: 'number', minimum: 0 },
              unitCost: { bsonType: 'number', minimum: 0 },
              supplier: { bsonType: 'string' },
              expiryDate: { bsonType: 'date' },
              date: { bsonType: 'date' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        },
        indexes: [
          { key: { userId: 1 } },
          { key: { itemType: 1 } },
          { key: { menuItemId: 1 } },
          { key: { userId: 1, itemType: 1 } }
        ]
      },
      {
        name: 'user_data',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['username', 'dataType', 'data'],
            properties: {
              username: { bsonType: 'string' },
              dataType: { enum: ['menuItems', 'orders', 'inventory', 'settings'] },
              data: { bsonType: 'array' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        },
        indexes: [
          { key: { username: 1, dataType: 1 }, unique: true }
        ]
      },
      {
        name: 'employees',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'position', 'userId'],
            properties: {
              name: { bsonType: 'string', minLength: 2 },
              position: { bsonType: 'string' },
              salary: { bsonType: 'number', minimum: 0 },
              phone: { bsonType: 'string' },
              email: { bsonType: 'string' },
              userId: { bsonType: 'string' },
              isActive: { bsonType: 'bool' },
              hireDate: { bsonType: 'date' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        },
        indexes: [
          { key: { userId: 1 } },
          { key: { email: 1 }, sparse: true }
        ]
      },
      {
        name: 'suppliers',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'userId'],
            properties: {
              name: { bsonType: 'string', minLength: 2 },
              contact: { bsonType: 'string' },
              phone: { bsonType: 'string' },
              email: { bsonType: 'string' },
              address: { bsonType: 'string' },
              userId: { bsonType: 'string' },
              isActive: { bsonType: 'bool' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        },
        indexes: [
          { key: { userId: 1 } },
          { key: { name: 1, userId: 1 } }
        ]
      },
      {
        name: 'sales_reports',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['userId', 'date', 'totalSales', 'totalOrders'],
            properties: {
              userId: { bsonType: 'string' },
              date: { bsonType: 'date' },
              totalSales: { bsonType: 'number', minimum: 0 },
              totalOrders: { bsonType: 'number', minimum: 0 },
              topItems: { bsonType: 'array' },
              paymentMethods: { bsonType: 'object' },
              createdAt: { bsonType: 'date' }
            }
          }
        },
        indexes: [
          { key: { userId: 1, date: -1 } },
          { key: { date: -1 } }
        ]
      },
      {
        name: 'system_settings',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['userId', 'settings'],
            properties: {
              userId: { bsonType: 'string' },
              settings: { bsonType: 'object' },
              theme: { bsonType: 'string' },
              currency: { bsonType: 'string' },
              timezone: { bsonType: 'string' },
              updatedAt: { bsonType: 'date' }
            }
          }
        },
        indexes: [
          { key: { userId: 1 }, unique: true }
        ]
      }
    ];

    console.log('\n📋 Setting up collections...');
    
    for (const collectionConfig of collections) {
      try {
        // Check if collection exists
        const existingCollections = await db.listCollections({ name: collectionConfig.name }).toArray();
        
        if (existingCollections.length > 0) {
          console.log(`⚠️  Collection '${collectionConfig.name}' already exists`);
          continue;
        }

        // Create collection with validator
        await db.createCollection(collectionConfig.name, {
          validator: collectionConfig.validator
        });
        
        console.log(`✅ Created collection: ${collectionConfig.name}`);
        
        // Create indexes
        if (collectionConfig.indexes && collectionConfig.indexes.length > 0) {
          const collection = db.collection(collectionConfig.name);
          for (const index of collectionConfig.indexes) {
            await collection.createIndex(index.key, { 
              unique: index.unique || false,
              sparse: index.sparse || false 
            });
          }
          console.log(`   📊 Created ${collectionConfig.indexes.length} index(es)`);
        }
        
      } catch (error) {
        console.error(`❌ Error creating collection ${collectionConfig.name}:`, error.message);
      }
    }

    // Insert sample data for testing
    console.log('\n🔄 Adding sample data...');
    
    // Sample admin user
    const usersCollection = db.collection('users');
    const adminExists = await usersCollection.findOne({ username: 'admin' });
    
    if (!adminExists) {
      await usersCollection.insertOne({
        username: 'admin',
        password: 'admin123', // In production, this should be hashed
        role: 'admin',
        email: 'admin@crm.com',
        phone: '+250788123456',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Created admin user (username: admin, password: admin123)');
    }

    // Sample restaurant
    const restaurantsCollection = db.collection('restaurants');
    const restaurantExists = await restaurantsCollection.findOne({ tenantId: 'default' });
    
    if (!restaurantExists) {
      await restaurantsCollection.insertOne({
        tenantId: 'default',
        name: 'Sample Restaurant',
        address: 'Kigali, Rwanda',
        phone: '+250788123456',
        email: 'info@restaurant.com',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Created sample restaurant');
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Collections created:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    console.log('\n🔐 Default credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    await client.close();
  }
}

setupCollections();