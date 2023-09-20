import pdfMake from "pdfmake/build/pdfmake";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { updateFileUser } from "@/lib/payrollDetails";
import { bucket } from "@/lib/gcs";
import { ENDPOINTS } from "@/app/constant/api";
import { convertMonthToString } from "@/utils/helper";
import { createPdfTemplate } from "@/utils/templatePdf";
import { updateFileUrls } from "@/firebase/payrolls";

// Register the PDF fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const POST = async (req: NextRequest, res: NextApiResponse) => {
  const body = await req.json();
  const { month, year, payrollDetails } = body;

  payrollDetails?.forEach(async (user: any) => {
    const password = user.employeeCode;
    const docDefinition = {
      content: createPdfTemplate({
        name: user.fullName,
        month: month,
        year: year,
        actualSalary: user.salary,
        wiseSalary: user.receiveWise,
        vnBankSalary: user.receiveCLVN,
        offeredSalary: user.offeredSalary,
        dailySalary: Math.floor(user.offeredSalary / 21),
        monthlySalary: user.salary,
        nightShiftSalary: user.nightShiftSalary,
        nightShiftHours: user.nightShiftHours,
        overtimeSalary: user.overtime,
        overtime2xHours: user.overtime2xHours,
        overtime2xSalary: user.overtime2xSalary,
        overtime3xHours: user.overtime3xHours,
        overtime3xSalary: user.overtime3xSalary,
        allowance: user.allowance,
        lunch: user.lunch,
        petrol: user.petrol,
        mobile: user.otherAllowance,
        parking: user.parking,
        software: user.otherAllowance,
        leaveBalance: user.leaveBalance,
        others: user.other,
        total: user.total,
        hasNightShift: !!user.nightShiftHours,
      }),
      // Set the password for the PDF
      userPassword: password,
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    // Generate the PDF buffer using pdfmake

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      pdfDocGenerator.getBuffer((result) => {
        resolve(result);
      });
    });

    const filename = `PaymentDetail_${user.fullName}_${convertMonthToString(
      month
    )}_${year}.pdf`;
    const bucketName = process.env.GCS_BUCKET;
    const fileblob = bucket.file(filename);
    const blobStream = fileblob.createWriteStream();
    blobStream.on("finish", () => {
      console.log("generate finished");
      const url = `https://storage.googleapis.com/${bucketName}/${filename}`;
      // Store the URL in your database
      updateFileUrls(user.fullName, month, year, url);
    });

    blobStream.on("error", (error) => {
      // Handle any errors that occur during the file upload
      console.error("Error uploading file:", error);
      return NextResponse.json({ success: false, error: error });
    });
    blobStream.end(buffer);
  });

  return NextResponse.json({ success: true });
};
