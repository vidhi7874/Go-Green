export const exportData = {
  convertToCSV: (data, columns) => {
    console.log("data ", data);
    console.log("columns ", columns);
    const headers = columns.map((column) => column.header);
    const csvRows = [];

    // Add header row
    csvRows.push(headers.join(","));

    // Add data rows
    data.forEach((item) => {
      const values = columns.map((column) => item[column.selector]);
      csvRows.push(values.join(","));
    });

    return csvRows.join("\n");
  },
};
