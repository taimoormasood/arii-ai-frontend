import { LandingHero } from "@/assets/images";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingHeader } from "@/components/landing/landing-header";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />

      <main>
        <section
          className={`relative w-full md:h-[450px] h-92 flex items-center justify-center bg-center bg-cover bg-no-repeat`}
          style={{
            backgroundImage: `url(${LandingHero.src})`,
          }}
        >
          {/* Content */}
          <div className="relative z-10 text-center px-4 md:px-0 w-full max-w-4xl mx-auto">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl md:text-6xl font-bold text-white mb-8 max-w-3xl mx-auto">
                Privacy Policy
              </h1>
            </div>
          </div>
        </section>
        {/* Main Content */}
        <div className="max-w-max mx-auto px-6 py-12">
          <CardContent className="p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to Guru ("we," "our," or "us"). This Privacy Policy
                describes how we collect, use, disclose, and protect your
                personal information when you use our website, mobile
                application, and related services (collectively, the "Service").
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using our Service, you agree to the collection and use of
                information in accordance with this policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Information We Collect
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Information You Provide
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>
                      Account registration information (name, email, phone
                      number)
                    </li>
                    <li>
                      Profile information (bio, profile picture, certifications)
                    </li>
                    <li>Service listings and descriptions</li>
                    <li>Communication data (messages, reviews, ratings)</li>
                    <li>Payment and billing information</li>
                    <li>Identity verification documents</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Information We Collect Automatically
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>
                      Device information (IP address, browser type, operating
                      system)
                    </li>
                    <li>
                      Usage data (pages visited, time spent, click patterns)
                    </li>
                    <li>Location data (with your permission)</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Information from Third Parties
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>
                      Social media platforms (when you connect your accounts)
                    </li>
                    <li>Background check providers</li>
                    <li>Payment processors</li>
                    <li>Marketing partners and analytics providers</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How We Use Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect for various purposes,
                including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>To provide, maintain, and improve our Service</li>
                <li>To process transactions and send related information</li>
                <li>
                  To send you technical notices, updates, and support messages
                </li>
                <li>
                  To respond to your comments, questions, and customer service
                  requests
                </li>
                <li>
                  To communicate with you about products, services, and events
                </li>
                <li>To monitor and analyze trends, usage, and activities</li>
                <li>
                  To detect, investigate, and prevent fraudulent transactions
                </li>
                <li>To comply with legal obligations and protect our rights</li>
              </ul>
            </section>

            {/* How We Share Your Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How We Share Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell your personal information. However, we may share
                your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>With other users:</strong> Your profile information
                  and service listings are visible to other users
                </li>
                <li>
                  <strong>With service providers:</strong> We share information
                  with third-party vendors who perform services on our behalf
                </li>
                <li>
                  <strong>For legal reasons:</strong> We may disclose
                  information if required by law or to protect our rights
                </li>
                <li>
                  <strong>Business transfers:</strong> Information may be
                  transferred in connection with mergers or acquisitions
                </li>
                <li>
                  <strong>With your consent:</strong> We may share information
                  for other purposes with your explicit consent
                </li>
              </ul>
            </section>

            {/* Cookies & Tracking Technologies */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Cookies & Tracking Technologies
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to collect and
                track information and to improve our Service. Types of cookies
                we use include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>Essential cookies:</strong> Required for the website
                  to function properly
                </li>
                <li>
                  <strong>Analytics cookies:</strong> Help us understand how
                  visitors interact with our website
                </li>
                <li>
                  <strong>Functional cookies:</strong> Enable enhanced
                  functionality and personalization
                </li>
                <li>
                  <strong>Advertising cookies:</strong> Used to deliver relevant
                  advertisements
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                You can control cookies through your browser settings, but
                disabling certain cookies may affect website functionality.
              </p>
            </section>

            {/* Data Retention & Security */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Data Retention & Security
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Data Retention
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We retain your personal information for as long as necessary
                    to provide our services, comply with legal obligations,
                    resolve disputes, and enforce our agreements. When we no
                    longer need your information, we will securely delete or
                    anonymize it.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Security Measures
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We implement appropriate technical and organizational
                    security measures to protect your personal information
                    against unauthorized access, alteration, disclosure, or
                    destruction. However, no method of transmission over the
                    internet is 100% secure.
                  </p>
                </div>
              </div>
            </section>

            {/* International Users */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                International Users
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our Service is operated from the United States. If you are
                accessing our Service from outside the United States, please be
                aware that your information may be transferred to, stored, and
                processed in the United States where our servers are located and
                our central database is operated.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Changes to This Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date. We encourage you
                to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            {/* Contact Information */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="text-gray-700 space-y-2">
                  <li>
                    <strong>Email:</strong> privacy@guru.com
                  </li>
                  <li>
                    <strong>Address:</strong> 123 Privacy Street, Suite 100, New
                    York, NY 10001
                  </li>
                  <li>
                    <strong>Phone:</strong> (555) 123-4567
                  </li>
                </ul>
              </div>
            </section>
          </CardContent>
        </div>
      </main>
      <Footer />
    </div>
  );
}
