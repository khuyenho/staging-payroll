import { HEADERS } from "@/constant/header";
import { users } from "@prisma/client";
import { Decimal } from "decimal.js";
import moment from "moment";
/**
 * Flatten a multidimensional object
 *
 * For example:
 *   flattenObject{ a: 1, b: { c: 2 } }
 * Returns:
 *   { a: 1, c: 2}
 */
export const flattenObject = (
  obj: Record<string, any>
): Record<string, any> => {
  const flattened: Record<string, any> = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      !Decimal.isDecimal(value)
    ) {
      Object.assign(flattened, flattenObject(value));
    } else {
      flattened[key] = value;
    }
  });

  // return obj;
  return flattened;
};

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const numberWithCommas = (n: number | string) => {
  return Number(n).toLocaleString();
};

export const formatDateTime = (
  dateTime: string,
  givenFormat: string = "yyyy-MM-DD hh:mm"
): string => {
  return moment(dateTime).format(givenFormat);
};

export function validateFileFormat(fileName: string) {
  // Regular expression pattern to match "MM_yyyy" format
  const pattern = /^(0[1-9]|1[0-2])_\d{4}\.(xlsx|xls)$/;

  // Check if the string matches the pattern
  return pattern.test(fileName);
}

export const fetcher = (url: string) =>
  fetch(url).then((res) =>
    res.json().catch((err) => {
      console.log(err);
    })
  );

export const convertMonthToString = (month: number | string) => {
  // Convert the month number to a string
  const monthString = month.toString();

  // Pad the string with leading zeros if necessary
  const paddedMonth = monthString.padStart(2, "0");

  return paddedMonth;
};

export const validateEmployeeImportFile = (header: string[]) => {
  if (
    header[0] === "ID" &&
    header[1] === "Name" &&
    header[2] === "Email" &&
    header[3] === "Employee Code"
  )
    return true;
  return false;
};

export const convertHeaderAttribute = (header: string) => {
  const words = header.split(" ");
  for (let i = 1; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }
  const newHeader = words.join("");
  const translateHeader = newHeader.replace("OT", "Overtime");
  return translateHeader.charAt(0).toLowerCase() + translateHeader.slice(1);
};

export const getPaymentDataFromFile = ({
  header,
  dataArray,
  users,
}: {
  header: string[];
  dataArray: any[];
  users: users[];
}) => {
  let totalMoney = 0;

  const resultArray: { [key: string]: any }[] = [];
  dataArray.forEach((row) => {
    const obj: { [key: string]: any } = {};
    let isExisted = false;

    header.forEach((attribute: string, idx: number) => {
      const key = convertHeaderAttribute(attribute);
      if (key.trim().toLowerCase() === HEADERS.total) {
        if (row[idx]) {
          totalMoney += row[idx];
        }
      }

      if (key !== "#" && key !== "latestInSGD-Wise") obj[key] = row[idx];

      if (key === "fullName") {
        const isNameEqualIdx = users.findIndex(
          (user: users) => user.name === row[idx]
        );

        if (isNameEqualIdx === -1) {
          isExisted = true;
          return;
        } else {
          obj["email"] = users[isNameEqualIdx]?.email;
          obj["employeeCode"] = users[isNameEqualIdx]?.employee_code;
          obj["createdAt"] = Date.now();
        }
      }
    });

    if (!isExisted) resultArray.push(obj);
    else {
      isExisted = false;
    }
  });

  return { totalMoney, payrollDetails: resultArray };
};
