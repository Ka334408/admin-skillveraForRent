"use client";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { redirect, useRouter } from "next/navigation";
import HeroSection from "../components/userview/heroSection";
import SearchSection from "../components/userview/searchBar";

import CategoriesSection from "../components/userview/catigories";

export default function HomePage() {

    redirect("/userview/Home")
 

  
}