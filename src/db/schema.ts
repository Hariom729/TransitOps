import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'] }).notNull(),
});

export const vehicles = sqliteTable('vehicles', {
  id: text('id').primaryKey(),
  registrationNumber: text('registration_number').notNull().unique(),
  nameModel: text('name_model').notNull(),
  type: text('type').notNull(),
  maxLoadCapacity: real('max_load_capacity').notNull(), // in kg
  odometer: real('odometer').notNull().default(0), // in km
  acquisitionCost: real('acquisition_cost').notNull(),
  status: text('status', { enum: ['Available', 'On Trip', 'In Shop', 'Retired'] }).notNull().default('Available'),
});

export const drivers = sqliteTable('drivers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  licenseNumber: text('license_number').notNull().unique(),
  licenseCategory: text('license_category').notNull(),
  licenseExpiryDate: text('license_expiry_date').notNull(), // ISO date string
  contactNumber: text('contact_number').notNull(),
  safetyScore: integer('safety_score').notNull().default(100),
  status: text('status', { enum: ['Available', 'On Trip', 'Off Duty', 'Suspended'] }).notNull().default('Available'),
});

export const trips = sqliteTable('trips', {
  id: text('id').primaryKey(),
  source: text('source').notNull(),
  destination: text('destination').notNull(),
  vehicleId: text('vehicle_id').notNull().references(() => vehicles.id, { onDelete: 'cascade' }),
  driverId: text('driver_id').notNull().references(() => drivers.id, { onDelete: 'cascade' }),
  cargoWeight: real('cargo_weight').notNull(), // in kg
  plannedDistance: real('planned_distance').notNull(), // in km
  status: text('status', { enum: ['Draft', 'Dispatched', 'Completed', 'Cancelled'] }).notNull().default('Draft'),
  createdAt: text('created_at').notNull(),
  completedAt: text('completed_at'),
  fuelConsumed: real('fuel_consumed'),
  finalOdometer: real('final_odometer'),
});

export const maintenanceLogs = sqliteTable('maintenance_logs', {
  id: text('id').primaryKey(),
  vehicleId: text('vehicle_id').notNull().references(() => vehicles.id, { onDelete: 'cascade' }),
  tripId: text('trip_id').references(() => trips.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  cost: real('cost').notNull(),
  date: text('date').notNull(),
  status: text('status', { enum: ['Active', 'Closed'] }).notNull().default('Active'),
});

export const fuelLogs = sqliteTable('fuel_logs', {
  id: text('id').primaryKey(),
  vehicleId: text('vehicle_id').notNull().references(() => vehicles.id, { onDelete: 'cascade' }),
  tripId: text('trip_id').references(() => trips.id, { onDelete: 'cascade' }),
  liters: real('liters').notNull(),
  cost: real('cost').notNull(),
  date: text('date').notNull(),
});

export const expenses = sqliteTable('expenses', {
  id: text('id').primaryKey(),
  vehicleId: text('vehicle_id').references(() => vehicles.id, { onDelete: 'cascade' }),
  tripId: text('trip_id').references(() => trips.id, { onDelete: 'cascade' }),
  category: text('category').notNull(),
  amount: real('amount').notNull(),
  date: text('date').notNull(),
  description: text('description'),
});
