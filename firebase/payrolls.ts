import { db } from "./config";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { Payroll, PayrollDetail, StrictPayroll } from "@/types/payroll";

// Create a new payroll document
export const createPayroll = async ({
  month,
  year,
  total,
  payrollDetails,
}: StrictPayroll) => {
  // Add a new document with a generated id
  const newPayrollRef = doc(collection(db, "payrolls"));

  try {
    await setDoc(newPayrollRef, {
      month: month,
      year: year,
      total: total,
      status: "New",
      payrollDetails: payrollDetails,
    });
    return NextResponse.json({ status: 200 });
  } catch (err) {
    console.log(err);
  }
};

export const getPayrolls = async ({ month, year }: Payroll) => {
  // Add a new document with a generated id
  const newPayrollRef = collection(db, "payrolls");
  let q;
  if (month && year) {
    q = query(
      newPayrollRef,
      where("month", "==", month),
      where("year", "==", year)
    );
  } else {
    q = query(newPayrollRef);
  }

  const querySnapshot = await getDocs(q);

  const res: any = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    res.push(doc.data());
  });
  return res;
};

export const deletePayroll = async ({ month, year }: Payroll) => {
  const newPayrollRef = collection(db, "payrolls");
  const q = query(
    newPayrollRef,
    where("month", "==", month),
    where("year", "==", year)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });
};

export const updateFileUrls = async (
  name: string,
  month: number,
  year: number,
  fileUrl: string
) => {
  try {
    const newPayrollRef = collection(db, "payrolls");
    const q = query(
      newPayrollRef,
      where("month", "==", month),
      where("year", "==", year)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (d) => {
      const payroll = d.data();
      const payrollDetails = payroll.payrollDetails;

      const matchedDetail = payroll.payrollDetails.find(
        (detail: PayrollDetail) => detail.fullName === name
      );
      if (matchedDetail) {
        // Element with matching name found in payrollDetails array
        matchedDetail["fileUrl"] = fileUrl;
        // Update the document with the modified payrollDetails array
        const payrollDocRef = doc(db, "payrolls", d.id);
        updateDoc(payrollDocRef, { payrollDetails });
      } else {
        // Element with matching name not found in payrollDetails array
        console.log("No matching detail found.");
      }
    });
  } catch (e) {
    return { e };
  }
};

export const updatePendingEmailStatus = async (month: number, year: number) => {
  try {
    const newPayrollRef = collection(db, "payrolls");
    const q = query(
      newPayrollRef,
      where("month", "==", month),
      where("year", "==", year)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (d) => {
      const payroll = d.data();
      const payrollDetails = payroll.payrollDetails;

      payrollDetails.forEach((payrollDetail: PayrollDetail) => {
        // Element with matching name found in payrollDetails array
        payrollDetail["emailStatus"] = "pending";
        // Update the document with the modified payrollDetails array
        const payrollDocRef = doc(db, "payrolls", d.id);
        updateDoc(payrollDocRef, { payrollDetails });
      });
    });
  } catch (e) {
    return { e };
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
    const newPayrollRef = collection(db, "payrolls");
    const q = query(
      newPayrollRef,
      where("month", "==", month),
      where("year", "==", year)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (d) => {
      const payroll = d.data();
      const payrollDetails = payroll.payrollDetails;

      payrollDetails.forEach((payrollDetail: PayrollDetail) => {
        if (successUsers.includes(payrollDetail.fullName))
          // Element with matching name found in payrollDetails array
          payrollDetail["emailStatus"] = "success";
        else if (failUsers.includes(payrollDetail.fullName)) {
          payrollDetail["emailStatus"] = "fail";
        }
        // Update the document with the modified payrollDetails array
        const payrollDocRef = doc(db, "payrolls", d.id);
        updateDoc(payrollDocRef, { payrollDetails });
      });
    });
  } catch (e) {
    return { e };
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
    const newPayrollRef = collection(db, "payrolls");
    const q = query(
      newPayrollRef,
      where("month", "==", month),
      where("year", "==", year)
    );
    const payrollSnapshot = await getDocs(q);

    const payrollDocs = payrollSnapshot.docs;

    if (payrollDocs.length === 1) {
      const payrollDoc = payrollDocs[0];
      payrollDoc;
      const payrollRef = doc(db, "payrolls", payrollDoc.id);

      await updateDoc(payrollRef, {
        status: "Paid",
      });
    }
  } catch (e) {
    console.log(e);

    return { error: e };
  }
};
