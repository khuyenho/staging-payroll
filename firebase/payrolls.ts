import { PayrollQuery, PayrollDetail, StrictPayroll } from "@/types/payroll";
import { PAYROLL_STATUS } from "@/constant/payrollStatus";
import db from "./config";
import { DocumentData } from "@google-cloud/firestore";

export const createPayroll = async ({
  month,
  year,
  total,
  payrollDetails,
}: StrictPayroll) => {
  const payrollRef = db.collection("payrolls").doc();

  try {
    await payrollRef.set({
      month: month,
      year: year,
      total: total,
      status: PAYROLL_STATUS.new,
      payrollDetails: payrollDetails,
    });

    return { status: 200 };
  } catch (err) {
    console.log(err);
    return { status: 500 };
  }
};

export const getPayrolls = async ({ month, year }: PayrollQuery) => {
  let q;
  if (month && year) {
    q = db
      .collection("payrolls")
      .where("month", "==", month)
      .where("year", "==", year);
  } else {
    q = db.collection("payrolls");
  }

  const querySnapshot = await q.get();

  const res: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    res.push(doc.data());
  });
  return res;
};

export const deletePayroll = async ({ month, year }: PayrollQuery) => {
  const payrollRef = db.collection("payrolls");
  const querySnapshot = await payrollRef
    .where("month", "==", month)
    .where("year", "==", year)
    .get();

  const deletionPromises: Promise<FirebaseFirestore.WriteResult>[] = [];
  querySnapshot.forEach((doc) => {
    deletionPromises.push(doc.ref.delete());
  });

  try {
    await Promise.all(deletionPromises);
    return { status: 200 };
  } catch (err) {
    console.log(err);
    return { status: 500 };
  }
};

export const updateFileUrls = async (
  month: number,
  year: number,
  payrollDetails: PayrollDetail[]
) => {
  try {
    const payrollRef = db.collection("payrolls");
    const querySnapshot = await payrollRef
      .where("month", "==", month)
      .where("year", "==", year)
      .get();

    if (querySnapshot.size === 1) {
      const payrollDoc = querySnapshot.docs[0];
      await payrollDoc.ref.update({
        payrollDetails: payrollDetails,
      });
    }

    return { status: 200 };
  } catch (err) {
    console.log(err);
    return { status: 500 };
  }
};

export const updatePendingEmailStatus = async (month: number, year: number) => {
  try {
    const payrollRef = db.collection("payrolls");
    const querySnapshot = await payrollRef
      .where("month", "==", month)
      .where("year", "==", year)
      .get();

    querySnapshot.forEach(async (doc) => {
      const payroll = doc.data();
      const payrollDetails = payroll.payrollDetails;
      payrollDetails.forEach((payrollDetail: PayrollDetail) => {
        payrollDetail.emailStatus = "pending";
      });

      const payrollDocRef = payrollRef.doc(doc.id);
      await payrollDocRef.update({ payrollDetails });
    });

    return { status: 200 };
  } catch (err) {
    console.log(err);
    return { status: 500 };
  }
};

export const updateFinishedEmailStatus = async ({
  month,
  year,
  successUsers,
  failUsers,
}: {
  month: number;
  year: number;
  successUsers: string[];
  failUsers: string[];
}) => {
  try {
    const payrollRef = db.collection("payrolls");
    const querySnapshot = await payrollRef
      .where("month", "==", month)
      .where("year", "==", year)
      .get();

    querySnapshot.forEach(async (doc) => {
      const payroll = doc.data();
      const payrollDetails = payroll.payrollDetails;
      payrollDetails.forEach((payrollDetail: PayrollDetail) => {
        if (successUsers.includes(payrollDetail.fullName)) {
          payrollDetail.emailStatus = "success";
        } else if (failUsers.includes(payrollDetail.fullName)) {
          payrollDetail.emailStatus = "fail";
        }
      });

      const payrollDocRef = payrollRef.doc(doc.id);
      await payrollDocRef.update({ payrollDetails });
    });

    return { status: 200 };
  } catch (err) {
    console.log(err);
    return { status: 500 };
  }
};

export const updatePayrollStatus = async ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  try {
    const payrollRef = db.collection("payrolls");
    const querySnapshot = await payrollRef
      .where("month", "==", month)
      .where("year", "==", year)
      .get();

    if (querySnapshot.size === 1) {
      const payrollDoc = querySnapshot.docs[0];
      const payrollDocRef = payrollRef.doc(payrollDoc.id);
      await payrollDocRef.update({ status: PAYROLL_STATUS.paid });
      return { status: 200 };
    } else {
      return { status: 404 };
    }
  } catch (err) {
    console.log(err);
    return { status: 500 };
  }
};
