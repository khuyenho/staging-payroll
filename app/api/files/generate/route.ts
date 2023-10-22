import pdfMake from "pdfmake/build/pdfmake";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { bucket } from "@/lib/gcs";
import { convertMonthToString } from "@/utils/helper";
import { createPdfTemplate } from "@/utils/templatePdf";
import { updateFileUrls } from "@/firebase/payrolls";

// Register the PDF fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const POST = async (req: NextRequest, res: NextApiResponse) => {
  const body = await req.json();
  const { month, year, payrollDetails } = body;

  const promises = payrollDetails?.map(async (user: any) => {
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
        monthlySalary: user.salary - user.nightShiftSalary,
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
    return new Promise<void>((resolve, reject) => {
      blobStream.on("finish", async () => {
        const url = `https://storage.googleapis.com/${bucketName}/${filename}`;

        user.fileUrl = url;

        resolve();
      });

      blobStream.on("error", (error) => {
        // Handle any errors that occur during the file upload
        console.error("Error uploading file:", error);
        reject(error);
      });

      blobStream.end(buffer);
    });
  });

  try {
    await Promise.all(promises);
    // Store the URL in your database
    await updateFileUrls(month, year, payrollDetails);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
};
