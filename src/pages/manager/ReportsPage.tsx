import React from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { exportTenantsToCSV, exportPaymentsToCSV, exportOccupancyToCSV } from '../../utils/exportUtils';
import { exportTenantsPDF } from '../../utils/pdfGenerator';
import { FileSpreadsheet, Download, FileText, Users, CreditCard, BedDouble } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { tenants, payments, rooms, settings } = useData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-indigo-600" /> Reports & Analytics Export Engine
        </h1>
        <p className="text-xs text-slate-500 mt-1">Export comprehensive data reports in CSV, Excel, and PDF formats.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Export Tenants Card */}
        <Card className="p-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold mb-4 border border-indigo-500/20">
            <Users className="w-6 h-6" />
          </div>
          <CardTitle>Tenants Master Report</CardTitle>
          <CardDescription className="mt-1">
            Includes active and vacated tenant directory, joining dates, monthly rent, deposits, and emergency contact details.
          </CardDescription>

          <div className="space-y-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              className="w-full"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => exportTenantsToCSV(tenants)}
            >
              Export CSV / Excel (.csv)
            </Button>
            <Button
              variant="primary"
              className="w-full"
              leftIcon={<FileText className="w-4 h-4" />}
              onClick={() => exportTenantsPDF(tenants, settings)}
            >
              Export Printable PDF (.pdf)
            </Button>
          </div>
        </Card>

        {/* Export Payments Card */}
        <Card className="p-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-4 border border-emerald-500/20">
            <CreditCard className="w-6 h-6" />
          </div>
          <CardTitle>Payment & Revenue Ledger</CardTitle>
          <CardDescription className="mt-1">
            Complete transaction register with receipt numbers, paid amounts, late charges, due dates, and payment channels.
          </CardDescription>

          <div className="space-y-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              className="w-full"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => exportPaymentsToCSV(payments)}
            >
              Export CSV / Excel (.csv)
            </Button>
          </div>
        </Card>

        {/* Export Occupancy Card */}
        <Card className="p-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4 border border-amber-500/20">
            <BedDouble className="w-6 h-6" />
          </div>
          <CardTitle>Room & Occupancy Audit</CardTitle>
          <CardDescription className="mt-1">
            Floor-by-floor breakdown of room capacities, occupied vs vacant bed counts, and occupancy percentages.
          </CardDescription>

          <div className="space-y-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              className="w-full"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => exportOccupancyToCSV(rooms)}
            >
              Export CSV / Excel (.csv)
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
};
