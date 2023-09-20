import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { SENDER_EMAIL } from "@/app/constant/email";
import { getFileFromStorage, storage } from "@/lib/gcs";
import { ENDPOINTS } from "@/app/constant/api";
import {
  updateFinishedEmailStatus,
  updatePayrollStatus,
  updatePendingEmailStatus,
} from "@/firebase/payrolls";

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export const POST = async (request: Request) => {
  // const session = await getServerSession(authOptions);
  // if (session) {

  try {
    const req = await request.json(); // res now contains body
    const { month, year, payrollDetails } = req;

    // update to status pending
    await updatePendingEmailStatus(month, year);

    const res = Promise.allSettled(
      payrollDetails.map((payrollDetail: any, idx: number) =>
        sendEmailWithAttachment({
          toEmail: payrollDetail.email,
          employeeName: payrollDetail.fullName,
          month,
          year,
          fileUrl: payrollDetail.fileUrl,
        })
      )
    ).then((res) => {
      const successUsers: string[] = [];
      const failUsers: string[] = [];
      // based on res update status success or fail
      res.forEach((promise, idx) => {
        if (promise.status === "fulfilled")
          successUsers.push(payrollDetails[idx].fullName);
        else failUsers.push(payrollDetails[idx].fullName);
      });

      updateFinishedEmailStatus({ month, year, successUsers, failUsers });
      updatePayrollStatus({ month, year });
    });

    return NextResponse.json(res);
  } catch (e) {
    console.log(e);
    return e;
  }
  //   return NextResponse.json(res);

  // }
  // return NextResponse.json({ error: "Unauthorized" }, { status: res.status });
};

type EmailType = {
  toEmail: string;
  employeeName: string;
  month: number;
  year: number;
  fileUrl: string;
};
// Function to send the file via email using SendGrid
const sendEmailWithAttachment = async ({
  toEmail,
  employeeName,
  month,
  year,
  fileUrl,
}: EmailType) => {
  const attachmentContent = await getFileFromStorage(fileUrl);

  const attachment = {
    content: attachmentContent?.toString("base64"),
    filename: `Payment Details_${employeeName}_${month}/${year}.pdf`,
    type: "application/pdf",
    disposition: "attachment",
  };

  const msg = {
    to: toEmail,
    from: SENDER_EMAIL,
    subject: `Payment Details_${employeeName}_${month}/${year}`,
    text: `Hi ${employeeName},\nPlease find attached your payment details for ${month}/${year}. The file is password protected, so please kindly use your unique employee code to open it.\nBest Regards.`,
    attachments: [attachment],
  };

  return sgMail.send(msg);
};
