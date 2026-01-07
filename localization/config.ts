import { Pathnames } from "next-intl/navigation";

export const locales = ["en", "ar"] as const;

export const pathnames = {
  "/": "/",
  "/userview/Home": {
    en: "/userview/Home",
    ar: "/userview/Home",
  },
  "/auth/login": {
    en: "/login",
    ar: "/login",
  },
  "/userview/useraccount": {
    en: "/userview/useraccount",
    ar: "/userview/useraccount",
  },
  "/auth/setNewPass": {
    en: "/setNewPass",
    ar: "/setNewPass",
  },
  "/auth/verifyAccount": {
    en: "/verifyAccount",
    ar: "/verifyAccount",
  },
  
  "/userview/aboutus": {
    en: "/userview/aboutus",
    ar: "/userview/aboutus",
  },
  "/userview/contactUs": {
    en: "/userview/contactUs",
    ar: "/userview/contactUs",
  },
  "/userview/allFacilities": {
    en: "/userview/allFacilities",
    ar: "/userview/allFacilities",
  },
  "/userview/allFacilities/${id}": {
    en: "/userview/allFacilities/${id}",
    ar: "/userview/allFacilities/${id}",
  },
  "/providerview/dashBoardHome/myFacilities": {
    en: "/providerview/dashBoardHome/myFacilities",
    ar: "/providerview/dashBoardHome/myFacilities",
  },
  "/providerview/dashBoardHome/myFacilities/addNewFacility": {
    en: "/providerview/dashBoardHome/myFacilities/addNewFacility",
    ar: "/providerview/dashBoardHome/myFacilities/addNewFacility",
  },
  "/providerview/dashBoardHome/dashBoard": {
    en: "/providerview/dashBoardHome/dashBoard",
    ar: "/providerview/dashBoardHome/dashBoard",
  },
  "/providerview/providerRegisteration": {
    en: "/providerview/providerRegisteration",
    ar: "/providerview/providerRegisteration",
  },
  '/auth/resetPass': {
    en: "/resetPass",
    ar: "/resetPass",
  },
  "/providerview/dashBoardHome/pendingApprove":{
    en:"/providerview/dashBoardHome/pendingApprove",
    ar :"/providerview/dashBoardHome/pendingApprove",
  },
  "/providerview/dashBoardHome/myProfile":{
    en:"/providerview/dashBoardHome/myProfile",
    ar:"/providerview/dashBoardHome/myProfile",
  },
  "/not-found": {
    en: "/not-found",
    ar: "/not-found",
  },
   "/auth/signUp": {
    en: "/signup",
    ar: "/signup",
  },
  "/error": {
    en: "/error",
    ar: "/error",
  },
} satisfies Pathnames<typeof locales>;

export const localePrefix = "as-needed";

export type AppPathnames = keyof typeof pathnames;
