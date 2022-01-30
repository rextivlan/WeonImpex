import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@mart.com",
    password: bcrypt.hashSync("1234567", 10),
    isAdmin: true,
  },
  {
    name: "Ali Affan",
    email: "ali@mart.com",
    password: bcrypt.hashSync("1234567", 10),
    isAdmin: true,
  },
  {
    name: "Lone Walker",
    email: "walker@mart.com",
    password: bcrypt.hashSync("1234567", 10),
  },
  {
    name: "Tayeeb Hasan",
    email: "tayeeb@mart.com",
    password: bcrypt.hashSync("1234567", 10),
    isAdmin: true,
  },
];

export default users;
