import PayrollTable from "@/components/payrollTable";
import ExcelInput from "@/components/excelInput";

export default function Payrolls() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 h-full">
      <div className="px-6 py-8 mx-auto md:h-full lg:py-0">
        <div>Import salary sheet to generate monthly payment PDF</div>
        <ExcelInput />

        <div className="bg-white my-6 rounded-md">
          <PayrollTable />
        </div>
      </div>
    </section>
  );
}
