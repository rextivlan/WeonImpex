import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@mart.com",
    phone: "7993918786",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Ali Affan",
    email: "ali@mart.com",
    phone: "7993918523",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Lone Walker",
    email: "walker@mart.com",
    phone: "1234567809",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Mohammed Anwar",
    email: "anwartda@gmail.com",
    phone: "9652517458",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
];

export default users;
