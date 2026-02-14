import Link from 'next/link';

export default function AboutPage() {
      return (
            <div className="py-16">
                  <div className="container-custom">
                        <div className="max-w-4xl mx-auto">
                              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
                                    About Us
                              </h1>

                              {/* Who We Are */}
                              <section className="mb-12">
                                    <h2 className="text-3xl font-bold text-primary-600 mb-6">Who We Are</h2>
                                    <p className="text-lg text-gray-700 leading-relaxed">
                                          Diversified Psychological Services exists to serve others. We seek to meet your needs where you are at through a safe and welcoming environment for all. We offer both in-person and online therapy sessions, allowing for flexibility and convenience. We understand that life can be hectic, so we aim to meet you where you are, whether that's in the office or via a secured online platform. We strongly believe in the client/therapist relationship and put emphasis on building a relationship/rapport with our clients. We see this relationship just like any other - each entity has to be willing to give a piece of themselves, and we hope our clients see us not only as their therapist, but also as someone who'll walk beside them in their journey.
                                    </p>
                              </section>

                              {/* Why We Are Different */}
                              <section className="mb-12 bg-gray-50 rounded-lg p-8">
                                    <h2 className="text-3xl font-bold text-primary-600 mb-6">Why We Are Different</h2>
                                    <div className="space-y-6">
                                          <div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Committed to the Process</h3>
                                                <p className="text-lg text-gray-700 leading-relaxed">
                                                      Our ideal clients are ones who are committed to change; ones who fall in love with the process. We often focus on the beginning and end of things, and downplay the middle as that is where the work is truly being done. We must learn to love the process. If committed to the process, change related to issues, needs, goals, etc will eventually be met, no matter how difficult.
                                                </p>
                                          </div>
                                          <div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Diversified Expertise</h3>
                                                <p className="text-lg text-gray-700 leading-relaxed">
                                                      As in our name, our therapists have a broad range of skillsets, education, and experience, allowing us to work with a diverse population of individuals and families ranging in age and intensity of needs.
                                                </p>
                                          </div>
                                    </div>
                              </section>

                              {/* What We Do */}
                              <section className="mb-12">
                                    <h2 className="text-3xl font-bold text-primary-600 mb-6">What We Do</h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                          <div className="bg-white border-2 border-primary-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Individual Therapy</h3>
                                                <p className="text-gray-700">One-on-one sessions tailored to your personal needs and goals.</p>
                                          </div>
                                          <div className="bg-white border-2 border-primary-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Family Therapy</h3>
                                                <p className="text-gray-700">Support for families working through challenges together.</p>
                                          </div>
                                          <div className="bg-white border-2 border-primary-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Couples Counseling</h3>
                                                <p className="text-gray-700">Helping couples strengthen their relationships and communication.</p>
                                          </div>
                                          <div className="bg-white border-2 border-primary-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">EAP Services</h3>
                                                <p className="text-gray-700">Employee Assistance Program services for workplace wellness.</p>
                                          </div>
                                    </div>
                                    <div className="mt-8 text-center">
                                          <Link href="/services" className="btn-primary inline-block">
                                                Learn More About Our Services
                                          </Link>
                                    </div>
                              </section>

                              {/* CTA */}
                              <div className="bg-primary-600 text-white rounded-lg p-8 text-center mt-12">
                                    <h2 className="text-2xl font-bold mb-4">Ready to Begin Your Journey?</h2>
                                    <p className="text-lg mb-6 text-primary-100">
                                          Contact us today to schedule an appointment with one of our experienced therapists.
                                    </p>
                                    <Link
                                          href="/contact"
                                          className="inline-block bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-colors"
                                    >
                                          Contact Us
                                    </Link>
                              </div>
                        </div>
                  </div>
            </div>
      );
}
