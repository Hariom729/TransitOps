import type { APIRoute } from 'astro';
import { db } from '../../db';
import { fuelLogs, maintenanceLogs, vehicles, trips } from '../../db/schema';

export const GET: APIRoute = async () => {
  const allVehicles = db.select().from(vehicles).all();
  const allTrips = db.select().from(trips).all();
  const allMaintenance = db.select().from(maintenanceLogs).all();
  const allFuel = db.select().from(fuelLogs).all();

  const rows = [
    ['Registration', 'Type', 'Status', 'Acquisition Cost ($)', 'Trips Completed', 'Maintenance Cost ($)', 'Fuel Cost ($)', 'ROI (%)'].join(',')
  ];

  for (const v of allVehicles) {
    const vTrips = allTrips.filter(t => t.vehicleId === v.id && t.status === 'Completed');
    const vMaint = allMaintenance.filter(m => m.vehicleId === v.id).reduce((sum, m) => sum + m.cost, 0);
    const vFuel = allFuel.filter(f => f.vehicleId === v.id).reduce((sum, f) => sum + f.cost, 0);
    
    const revenue = vTrips.length * 500;
    const opCost = vMaint + vFuel;
    const roi = v.acquisitionCost > 0 ? (((revenue - opCost) / v.acquisitionCost) * 100).toFixed(1) : '0';

    rows.push([
      v.registrationNumber,
      v.type,
      v.status,
      v.acquisitionCost,
      vTrips.length,
      vMaint.toFixed(2),
      vFuel.toFixed(2),
      roi
    ].join(','));
  }

  return new Response(rows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="transitops-analytics.csv"'
    }
  });
}
