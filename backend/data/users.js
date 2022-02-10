import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@mart.com",
    phone: "7993918786",
    password: bcrypt.hashSync("1234567", 10),
    isAdmin: true,
  },
  {
    name: "Ali Affan",
    email: "ali@mart.com",
    phone: "7993918523",
    password: bcrypt.hashSync("1234567", 10),
    isAdmin: true,
  },
  {
    name: "Lone Walker",
    email: "walker@mart.com",
    phone: "1234567809",
    password: bcrypt.hashSync("1234567", 10),
  },
  {
    name: "Tayeeb Hasan",
    email: "tayeeb@mart.com",
    phone: "7702647910",
    password: bcrypt.hashSync("1234567", 10),
    isAdmin: true,
  },
];

export default users;
