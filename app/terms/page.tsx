import { LandingHero } from "@/assets/images";
import { Footer } from "@/components/landing/footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { CardContent } from "@/components/ui/card";

export default function TermsPage() {
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
                Terms & Conditions
              </h1>
            </div>
          </div>
        </section>
        {/* Main Content */}
        <div className="max-w-max mx-auto px-6 py-12">
          <CardContent className="p-8 space-y-8">
            {/* Acceptance of Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing and using Guru, you agree to be bound by these
                Terms & Conditions and all applicable laws. If you do not agree
                with any of these terms, you are prohibited from using or
                accessing this site.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The materials contained in this website are protected by
                applicable copyright and trademark law.
              </p>
            </section>

            {/* Platform Overview */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Platform Overview
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Guru.com is a web-based property management solution offering
                tools for managing properties, tenants, vendors, tasks, and
                maintenance. The platform provides features such as AI
                recommendations, integrated booking, document uploads, and
                communication tools.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our service connects property managers with qualified vendors to
                streamline maintenance and service operations.
              </p>
            </section>

            {/* User Roles & Responsibilities */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                User Roles & Responsibilities
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">
                    Manager Accounts
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>
                      Responsible for creating and managing property, vendor,
                      and tenant data
                    </li>
                    <li>
                      Must ensure all uploaded information is accurate and
                      lawful
                    </li>
                    <li>
                      Account owner is responsible for subscription payment and
                      compliance
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">
                    Vendors
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>
                      Must provide accurate and up-to-date profile information
                    </li>
                    <li>
                      Responsible for maintaining job quality, submitting
                      invoices, and responding in a timely manner
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Accounts & Access */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                User Accounts & Access
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  You must provide accurate information and keep your login
                  credentials secure
                </li>
                <li>
                  You're responsible for all activities on your account due to
                  your failure to safeguard access
                </li>
                <li>
                  You must notify us if you suspect any breach of your account
                </li>
              </ul>
            </section>

            {/* Subscription & Payments */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Subscription & Payments
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  Plans are billed monthly or annually depending on your
                  selection
                </li>
                <li>
                  Failure to pay may result in suspension or cancellation of
                  your access
                </li>
                <li>
                  Refunds are handled on a case-by-case basis in accordance with
                  our refund policy
                </li>
              </ul>
            </section>

            {/* Task & Proposal Workflow */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Task & Proposal Workflow
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  Managers assign vendors to tasks or invite vendors to submit
                  proposals for approval
                </li>
                <li>
                  Vendor task deadlines are based on proposal vendor performance
                  of task outcomes
                </li>
              </ul>
            </section>

            {/* AI-Powered Recommendations */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                AI-Powered Recommendations
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  System classifies all tenant suggestions to improve efficiency
                </li>
                <li>
                  These are advisory tools and final decisions rest with the
                  user
                </li>
              </ul>
            </section>

            {/* Prohibited Activities */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Prohibited Activities
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Use the platform for illegal or unauthorized purposes</li>
                <li>Upload false, harmful, or offensive content</li>
                <li>Attempt to hack, damage, or disrupt the service</li>
              </ul>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Changes to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update these terms periodically. Continued use of the
                platform indicates acceptance of the updated terms. Users will
                be notified of significant changes.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Guru.com and its affiliates shall not be liable for any
                indirect, incidental, special, consequential, or punitive
                damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our total liability to you for all damages shall not exceed the
                amount paid by you to us in the twelve (12) months preceding the
                claim.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Governing Law
              </h2>
              <p className="text-gray-700 leading-relaxed">
                These terms shall be governed by and construed in accordance
                with the laws of the State of New York, without regard to its
                conflict of law provisions. Any disputes arising under these
                terms shall be subject to the exclusive jurisdiction of the
                courts located in New York.
              </p>
            </section>

            {/* Contact Information */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please
                contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="text-gray-700 space-y-2">
                  <li>
                    <strong>Email:</strong> legal@guru.com
                  </li>
                  <li>
                    <strong>Address:</strong> 123 Legal Street, Suite 200, New
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
