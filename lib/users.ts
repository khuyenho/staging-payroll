import prisma from "./prisma";

export const getUsers = async () => {
  try {
    const users = await prisma.users.findMany();

    return users;
  } catch (e) {
    return { e };
  }
};
export const getActiveUsers = async () => {
  try {
    const users = await prisma.users.findMany({
      where: {
        status: true,
      },
    });

    return users;
  } catch (e) {
    return { e };
  }
};
type UserProps = {
  name: string;
  email: string;
  employeeCode: string;
};

export const importUsers = async (userImportList: UserProps[]) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.users.updateMany({
        data: {
          status: false,
        },
      });
      for (const user of userImportList) {
        const existingUser = await tx.users.findFirst({
          where: { email: user.email },
        });

        if (existingUser) {
          // Update the existing user's data
          await tx.users.updateMany({
            where: { email: user.email },
            data: {
              name: user.name,
              employee_code: user.employeeCode,
              status: true,
            },
          });
        } else {
          // Create a new user
          await tx.users.create({
            data: {
              email: user.email,
              name: user.name,
              employee_code: user.employeeCode,
              status: true,
            },
          });
        }
      }
    });
  } catch (e) {
    return { e };
  }
};
