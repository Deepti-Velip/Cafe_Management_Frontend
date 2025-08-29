import React from "react";
import api from "../../lib/axios";

const Dashboard = () => {
  const downloadReport = async () => {
    try {
      const response = await api.get("/sales/excel", {
        responseType: "blob", // important for Excel download
      });

      // Create a blob link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "orders_report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading report:", err);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Staff Dashboard
        </h1>
        <div className="bg-white  rounded-2xl p-6 w-96 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Orders Report
          </h2>
          <p className="text-gray-600 mb-6">
            Download the latest orders report in Excel format.
          </p>
          <button
            onClick={downloadReport}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
          >
            Download Excel Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
