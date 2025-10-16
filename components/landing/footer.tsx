import Image from "next/image";
import Link from "next/link";

import FacebookIcon from "@/assets/icons/facebook-icon";
import GithubIcon from "@/assets/icons/github-icon";
import InstragramIcon from "@/assets/icons/instragram-icon";
import LinkedinIcon from "@/assets/icons/linkedin-icon";
import TwitterIcon from "@/assets/icons/twitter-icon";
import { logoBlack } from "@/assets/images";

export function Footer() {
  return (
    <footer className="bg-[#F8F8F8] text-white py-8 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0">
            <Link href="/">
              <Image src={logoBlack} width={146} height={57} alt="Logo" />
            </Link>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 md:gap-8">
            <Link
              href="/about"
              className="text-base font-medium text-[#1F2A37] hover:opacity-90 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/communities"
              className="text-base font-medium text-[#1F2A37] hover:opacity-90 transition-colors"
            >
              Communities
            </Link>
            <Link
              href="/how-it-works"
              className="text-base font-medium text-[#1F2A37] hover:opacity-90 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/why-rental-guru"
              className="text-base font-medium text-[#1F2A37] hover:opacity-90 transition-colors"
            >
              Why Rental Guru
            </Link>

            <Link
              href="/privacy-policy"
              className="text-base font-medium text-[#1F2A37] hover:opacity-90 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-base font-medium text-[#1F2A37] hover:opacity-90 transition-colors"
            >
              Terms & Conditions
            </Link>
          </nav>
        </div>

        <div className="border-t border-gray-400 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white  h-7 w-7 border border-[#6CA700] rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg  "
            >
              <FacebookIcon />
              <span className="sr-only">Facebook</span>
            </a>
            <a
              href="https://instragram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white  h-7 w-7 border border-[#6CA700] rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg "
            >
              <InstragramIcon />
              <span className="sr-only">Instragram</span>
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white   h-7 w-7 border border-[#6CA700] rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg "
            >
              <TwitterIcon />
              <span className="sr-only">Twitter</span>
            </a>
          </div>

          <p className="text-[14px] md:text-left text-center text-[#6B7280] mb-4 md:mb-0">
            © 2025 Rental Guru. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
