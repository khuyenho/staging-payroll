import * as XLSX from "xlsx";

const importSheetToJson = (
  file: File,
  sheetName: string,
  startRow: number
): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = e.target?.result;
      if (data instanceof ArrayBuffer) {
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          range: startRow,
        });

        // Filter out empty rows
        const processedData = jsonData.filter((row: any) => {
          return row.some((cell: any) => cell !== "");
        });

        resolve(processedData);
      } else {
        reject(new Error("Invalid file data"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    reader.readAsArrayBuffer(file);
  });
};

export default importSheetToJson;
