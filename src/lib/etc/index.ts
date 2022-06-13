import { CookieOptions } from "express";

export const cookieOption: CookieOptions = {
  httpOnly: true,
  signed: false,
  expires: new Date(Date.now() + 90000),
};

export const maxNumberOfImage = 5;
