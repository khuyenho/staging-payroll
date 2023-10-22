import React, { MouseEventHandler } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ROUTES } from "@/constant/routes";

function Header({
  username,
  onClick,
}: {
  username: string | null | undefined;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl w-screen">
          <div className="flex items-center gap-10">
            <Link href="/">
              <p className="font-bold text-lg"> Payroll Admin</p>
            </Link>
            <div className="flex gap-5">
              <Link href={ROUTES.payrolls}>
                <p className="hover:text-cyan-700">Payrolls</p>
              </Link>
              <Link href={ROUTES.employees}>
                <p className="hover:text-cyan-700">Employees</p>
              </Link>
            </div>
          </div>

          <div
            className="hidden justify-between items-center lg:flex lg:w-auto lg:order-1 w-full"
            id="mobile-menu-2"
          >
            {username && <div className="mr-4">{username}</div>}
            <Button variant={"outline"} onClick={onClick}>
              Log out
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
