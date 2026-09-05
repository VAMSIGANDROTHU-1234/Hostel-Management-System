import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey?: keyof T | ((item: T) => string);
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
  pageSize?: number;
  emptyMessage?: string;
}

export function Table<T extends { id?: string | number }>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search records...',
  onRowClick,
  pageSize = 8,
  emptyMessage = 'No records found.',
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Search filtering
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    return data.filter(item => {
      if (typeof searchKey === 'function') {
        return searchKey(item).toLowerCase().includes(searchTerm.toLowerCase());
      }
      if (searchKey && item[searchKey]) {
        return String(item[searchKey]).toLowerCase().includes(searchTerm.toLowerCase());
      }
      return JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm, searchKey]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = (a as any)[sortKey];
      const valB = (b as any)[sortKey];

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else setSortKey(null);
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Bar / Search */}
      {searchKey && (
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-charcoal-800/60 border border-slate-200 dark:border-charcoal-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Showing {paginatedData.length} of {filteredData.length} entries
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto border border-slate-200/80 dark:border-charcoal-800 rounded-2xl bg-white dark:bg-charcoal-900 shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-charcoal-800/40 border-b border-slate-200/80 dark:border-charcoal-800">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-6 py-3.5 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider ${
                    col.sortable ? 'cursor-pointer select-none hover:text-red-600' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && sortKey === col.key && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-red-600" /> : <ChevronDown className="w-3.5 h-3.5 text-red-600" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-charcoal-800/60 font-medium text-sm">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={item.id || index}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-red-500/10 dark:hover:bg-red-950/20' : 'hover:bg-slate-50/50 dark:hover:bg-charcoal-800/40'
                  }`}
                >
                  {columns.map(col => (
                    <td key={col.key} className="px-6 py-4 text-slate-700 dark:text-slate-200 whitespace-nowrap">
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500 font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 dark:border-charcoal-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-charcoal-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 dark:border-charcoal-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-charcoal-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
