import { TDocumentDefinitions, Content, Margins } from "pdfmake/interfaces";
import { convertMonthToString, numberWithCommas } from "./helper";

type PdfTemplateProps = {
  name: string;
  month: number;
  year: number;
  actualSalary: number;
  wiseSalary: number;
  vnBankSalary: number;
  offeredSalary: number;
  dailySalary?: number;
  monthlySalary?: number;
  nightShiftSalary?: number;
  nightShiftHours?: number;
  overtimeSalary: number;
  overtime2xHours: number;
  overtime2xSalary: number;
  overtime3xHours: number;
  overtime3xSalary: number;
  allowance: number;
  lunch: number;
  petrol: number;
  mobile: number;
  parking: number;
  software: number;
  leaveBalance: number;
  others: number;
  total: number;
  hasNightShift: boolean;
};
export const createPdfTemplate = (props: PdfTemplateProps) => {
  const lineBreak = {
    table: {
      headerRows: 1,
      widths: ["100%"],
      body: [[""], [""]],
    },
    layout: {
      hLineWidth: (i: number, node: any) => (i === 0 ? 1 : 0), // Set different line widths for header row and other rows
      vLineWidth: () => 0, // Hide vertical lines
    },
  };
  const marginCell = [0, 5, 0, 5] as Margins;
  const noMargin = [0, 0, 0, 0] as Margins;

  const common = [
    {
      text: `${props.name} - Salary - ${convertMonthToString(props.month)}/${
        props.year
      }`,
      fontSize: 13,
      bold: true,
      margin: [10, 0, 0, 10] as Margins, //left-top-right-bottom
    },
    {
      table: {
        widths: ["75%", "25%"],
        body: [
          [
            { text: "1. Actual Salary:", bold: true, margin: marginCell },
            {
              text: `${numberWithCommas(props.actualSalary)} VND`,
              alignment: "right",
              bold: true,
              margin: marginCell,
            },
          ],
          [
            {
              text: "2. Amount transfer via Wise:",
              margin: marginCell,
            },
            {
              text: `${numberWithCommas(props.wiseSalary)} VND`,
              alignment: "right",
              margin: marginCell,
            },
          ],
          [
            {
              text: "3. Amount transfer via VN Bank:",
              margin: marginCell,
            },
            {
              text: `${numberWithCommas(props.vnBankSalary)} VND`,
              alignment: "right",
              margin: marginCell,
            },
          ],
          [
            { text: "4. Offered Salary:", margin: marginCell },
            {
              text: `${numberWithCommas(props.offeredSalary)} VND`,
              alignment: "right",
              margin: marginCell,
            },
          ],
          [
            {
              stack: [
                {
                  text: "5. Daily salary:",
                  alignment: "left",
                  margin: marginCell,
                },
                {
                  text: "   = Offered Salary / 21",
                  alignment: "left",
                  italics: true,
                  fontSize: 12,
                  margin: marginCell,
                },
              ],
              alignment: "right",
            },
            {
              text: `${
                props.dailySalary && numberWithCommas(props.dailySalary)
              } VND`,
              alignment: "right",
              margin: marginCell,
            },
          ],
        ],
      },
      layout: "noBorders",
      margin: [20, 0, 30, 10] as Margins,
    },
    lineBreak,
  ];

  const detailWithNightShiftBody = [
    [
      { text: "6. Monthly Salary:", margin: marginCell },
      {
        text: `${
          props.monthlySalary && numberWithCommas(props.monthlySalary)
        } VND`,
        alignment: "right",
        margin: marginCell,
      },
    ],
    [
      {
        table: {
          widths: ["100%", "0%"],
          body: [
            ["Salary for your working hours exclude night-shift hours", ""],
            [
              {
                text: "= Number of Normal Working Hours * Your Hourly Rate",
                italics: true,
                fontSize: 12,
              },
              "",
            ],
          ],
        },
        layout: "noBorders",
        margin: [20, 0, 0, 0] as Margins,
      },
      "",
    ],
    [
      { text: "7. Night Shift:", margin: marginCell },
      {
        text: `${
          props.nightShiftSalary && numberWithCommas(props.nightShiftSalary)
        } VND`,
        alignment: "right",
        margin: marginCell,
      },
    ],
    [
      {
        table: {
          widths: ["100%", "0%"],
          body: [
            [`${props.nightShiftHours} hours with night shift`, ""],
            [
              {
                text: "= Number of Night Shift Hours * Your Hourly Rate * 2",
                italics: true,
                fontSize: 12,
              },
              "",
            ],
          ],
        },
        layout: "noBorders",
        margin: [20, 0, 0, 0] as Margins,
      },
      "",
    ],
    [
      {
        table: {
          widths: ["100%", "0%"],
          body: [
            [`${props.nightShiftHours} hours with night shift`, ""],
            [
              {
                text: "= Number of Night Shift Hours * Your Hourly Rate * 2",
                italics: true,
                fontSize: 12,
              },
              "",
            ],
          ],
        },
        layout: "noBorders",
        margin: [20, 0, 0, 0] as Margins,
      },
      "",
    ],
  ];

  let detailBody;
  if (props.hasNightShift) {
    detailBody = [
      ...detailWithNightShiftBody,
      [
        { text: "8. OT:", margin: marginCell },
        {
          text: `${numberWithCommas(props.overtimeSalary)} VND`,
          alignment: "right",
          margin: marginCell,
        },
      ],
      [
        {
          table: {
            widths: ["*", "*"],
            body: [
              [
                `${props.overtime2xHours} hours with 2x rate`,
                {
                  text: `${numberWithCommas(props.overtime2xSalary)} VND`,
                  alignment: "right",
                },
              ],
              [
                `${props.overtime3xHours} hour with 3x rate`,
                {
                  text: `${numberWithCommas(props.overtime3xSalary)} VND`,
                  alignment: "right",
                },
              ],
            ],
          },
          layout: "noBorders",
          margin: [30, 0, 0, 0] as Margins,
        },
        "",
      ],
      [
        { text: "9. Allowance:", margin: marginCell },
        {
          text: `${numberWithCommas(props.allowance)} VND`,
          alignment: "right",
          margin: marginCell,
        },
      ],
      [
        {
          table: {
            widths: ["70%", "30%"],
            body: [
              [
                { text: "Lunch", margin: noMargin },
                {
                  text: `${numberWithCommas(props.lunch)} VND`,
                  alignment: "right",
                  margin: noMargin,
                },
              ],
              [
                {
                  text: "= Number of Working Day * 40.000 VND",
                  fontSize: 12,
                  italics: true,
                  margin: noMargin,
                },
                "",
              ],
              [
                { text: "Petro", margin: noMargin },
                {
                  text: `${numberWithCommas(props.petrol)} VND`,
                  alignment: "right",
                  margin: noMargin,
                },
              ],
              [
                { text: "Parking", margin: noMargin },
                {
                  text: `${numberWithCommas(props.parking)} VND`,
                  alignment: "right",
                  margin: noMargin,
                },
              ],
              [
                { text: "Other allowance", margin: noMargin },
                {
                  text: `${numberWithCommas(props.software)} VND`,
                  alignment: "right",
                  margin: noMargin,
                },
              ],
            ],
          },
          layout: "noBorders",
          margin: [30, 0, 0, 0] as Margins,
        },
        "",
      ],
      [
        { text: "10. Leave balance:", margin: marginCell },
        {
          text: `${numberWithCommas(props.leaveBalance)} VND`,
          alignment: "right",
          margin: marginCell,
        },
      ],
      [
        { text: "11. Others:", margin: marginCell },
        {
          text: `${numberWithCommas(props.others)} VND`,
          alignment: "right",
        },
      ],
      [
        {
          table: {
            widths: ["*", "*"],
            body: [
              [
                "Others",
                {
                  text: `${numberWithCommas(props.others)} VND`,
                  alignment: "right",
                },
              ],
            ],
          },
          layout: "noBorders",
          margin: [30, 0, 0, 0] as Margins,
        },
        "",
      ],
    ];
  } else {
    detailBody = [
      [
        { text: "6. OT:", margin: marginCell },
        {
          text: `${numberWithCommas(props.overtimeSalary)} VND`,
          alignment: "right",
          margin: marginCell,
        },
      ],
      [
        {
          table: {
            widths: ["*", "*"],
            body: [
              [
                `${props.overtime2xHours} hours with 2x rate`,
                {
                  text: `${numberWithCommas(props.overtime2xSalary)} VND`,
                  alignment: "right",
                },
              ],
              [
                `${props.overtime3xHours} hour with 3x rate`,
                {
                  text: `${numberWithCommas(props.overtime3xSalary)} VND`,
                  alignment: "right",
                },
              ],
            ],
          },
          layout: "noBorders",
          margin: [30, 0, 0, 0] as Margins,
        },
        "",
      ],
      [
        { text: "7. Allowance:", margin: marginCell },
        {
          text: `${numberWithCommas(props.allowance)} VND`,
          alignment: "right",
          margin: marginCell,
        },
      ],
      [
        {
          table: {
            widths: ["70%", "30%"],
            body: [
              [
                { text: "Lunch", margin: noMargin },
                {
                  text: `${numberWithCommas(props.lunch)} VND`,
                  alignment: "right",
                  margin: noMargin,
                },
              ],
              [
                {
                  text: "= Number of Working Day * 40.000 VND",
                  fontSize: 12,
                  italics: true,
                  margin: noMargin,
                },
                "",
              ],
              [
                { text: "Petro", margin: noMargin },
                {
                  text: `${numberWithCommas(props.petrol)} VND`,
                  alignment: "right",
                  margin: noMargin,
                },
              ],
              [
                { text: "Parking", margin: noMargin },
                {
                  text: `${numberWithCommas(props.parking)} VND`,
                  alignment: "right",
                  margin: noMargin,
                },
              ],
              [
                { text: "Other allowance", margin: noMargin },
                {
                  text: `${numberWithCommas(props.software)} VND`,
                  alignment: "right",
                  margin: noMargin,
                },
              ],
            ],
          },
          layout: "noBorders",
          margin: [30, 0, 0, 0] as Margins,
        },
        "",
      ],
      [
        { text: "8. Leave balance:", margin: marginCell },
        {
          text: `${numberWithCommas(props.leaveBalance)} VND`,
          alignment: "right",
          margin: marginCell,
        },
      ],
      [
        { text: "9. Others:", margin: marginCell },
        {
          text: `${numberWithCommas(props.others)} VND`,
          alignment: "right",
        },
      ],
      [
        {
          table: {
            widths: ["*", "*"],
            body: [
              [
                "Others",
                {
                  text: `${numberWithCommas(props.others)} VND`,
                  alignment: "right",
                },
              ],
            ],
          },
          layout: "noBorders",
          margin: [30, 0, 0, 0] as Margins,
        },
        "",
      ],
    ];
  }

  return [
    ...common,
    {
      table: {
        widths: ["75%", "25%"],
        body: detailBody,
      },
      layout: "noBorders",
      margin: [20, 10, 30, 20] as Margins,
    },
    lineBreak,
    {
      table: {
        widths: ["75%", "25%"],
        body: [
          [
            { text: "Total", bold: true },
            {
              text: `${numberWithCommas(props.total)} VND`,
              alignment: "right",
              bold: true,
            },
          ],
        ],
      },
      layout: "noBorders",
      margin: [40, 20, 30, 10] as Margins, //left - top - right - bottom
    },
  ];
};
