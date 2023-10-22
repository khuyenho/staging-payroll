import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { SENDER_EMAIL } from "@/constant/email";
import { getFileFromStorage } from "@/lib/gcs";
import { EmailType } from "@/types/email";

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export const POST = async (request: Request) => {
  try {
    const req = await request.json(); // res now contains body
    const { email, employeeName, month, year, fileUrl } = req;

    const res = await sendEmailWithAttachment({
      toEmail: email,
      employeeName,
      month,
      year,
      fileUrl,
    });

    return NextResponse.json(res);
  } catch (e) {
    console.log(e);
    return e;
  }
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
