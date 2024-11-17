import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

interface InventoryItem {
  name: string;
  quantity: number;
  value: number;
}

interface SalesItem {
  name: string;
  quantity: number;
  total: number;
}

const Reports: React.FC = () => {
  const [inventoryReport, setInventoryReport] = useState<InventoryItem[]>([]);
  const [salesReport, setSalesReport] = useState<SalesItem[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalInventoryValue, setTotalInventoryValue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  const fetchInventoryReport = async () => {
    try {
      const response = await api.get("/api/reports/inventory");
      setInventoryReport(response.data.report);
      setTotalInventoryValue(response.data.totalValue);
      toast.success("Inventory report generated successfully");
    } catch (error) {
      toast.error("Failed to generate inventory report");
    }
  };

  const fetchSalesReport = async () => {
    try {
      if (!startDate || !endDate) {
        toast.error("Please select start and end dates");
        return;
      }
      const response = await api.get(
        `/api/reports/sales?startDate=${startDate}&endDate=${endDate}`
      );
      setSalesReport(response.data.report);
      setTotalSales(response.data.totalSales);
      toast.success("Sales report generated successfully");
    } catch (error) {
      toast.error("Failed to generate sales report");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Link
        to="/dashboard"
        className="mb-4 inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
      >
        &larr; Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Inventory Report</h2>
        <button
          onClick={fetchInventoryReport}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Generate Inventory Report
        </button>
        {inventoryReport.length > 0 && (
          <div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryReport.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${item.value.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 font-semibold">
              Total Inventory Value: ${totalInventoryValue.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Sales Report</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={fetchSalesReport}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Generate Sales Report
          </button>
        </div>
        {salesReport.length > 0 && (
          <div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Sales
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salesReport.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 font-semibold">
              Total Sales: ${totalSales.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
