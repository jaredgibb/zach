'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { therapists, insuranceProviders } from '@/lib/data';

export default function TherapistPage() {
      const params = useParams();
      const therapist = therapists.find(t => t.id === params.id);

      const [formData, setFormData] = useState({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            insurance: '',
            description: '',
            requestedTherapist: therapist?.name || '',
      });

      const [isSubmitting, setIsSubmitting] = useState(false);
      const [submitMessage, setSubmitMessage] = useState('');

      if (!therapist) {
            return (
                  <div className="py-16">
                        <div className="container-custom text-center">
                              <h1 className="text-4xl font-bold text-gray-900 mb-4">Therapist Not Found</h1>
                              <Link href="/therapists" className="text-primary-600 hover:underline">
                                    ← Back to Our Therapists
                              </Link>
                        </div>
                  </div>
            );
      }

      const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setIsSubmitting(true);
            setSubmitMessage('');

            // Simulate form submission
            setTimeout(() => {
                  setSubmitMessage('Thank you for contacting us! We will reach out to you within 1-2 business days.');
                  setIsSubmitting(false);
                  setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        insurance: '',
                        description: '',
                        requestedTherapist: therapist.name,
                  });
            }, 1000);
      };

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            setFormData({
                  ...formData,
                  [e.target.name]: e.target.value,
            });
      };

      return (
            <div className="py-16">
                  <div className="container-custom">
                        <div className="max-w-4xl mx-auto">
                              {/* Back Link */}
                              <Link
                                    href="/therapists"
                                    className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
                              >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to Our Therapists
                              </Link>

                              {/* Therapist Profile */}
                              <div className="mb-12">
                                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                                          {/* Photo */}
                                          <div className="md:col-span-1">
                                                <div className="relative h-80 bg-gray-200 rounded-lg overflow-hidden">
                                                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                            <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24">
                                                                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                            </svg>
                                                      </div>
                                                </div>
                                          </div>

                                          {/* Info */}
                                          <div className="md:col-span-2">
                                                <h1 className="text-4xl font-bold text-gray-900 mb-2">{therapist.name}</h1>
                                                <p className="text-2xl text-primary-600 font-medium mb-2">{therapist.credentials}</p>
                                                <p className="text-xl text-gray-600 mb-6">{therapist.title}</p>

                                                {therapist.funFact && (
                                                      <div className="bg-primary-50 border-l-4 border-primary-600 p-4 mb-6">
                                                            <p className="text-sm font-semibold text-primary-900 mb-1">Fun Fact:</p>
                                                            <p className="text-primary-800">{therapist.funFact}</p>
                                                      </div>
                                                )}
                                          </div>
                                    </div>

                                    {/* Full Bio */}
                                    <div className="prose prose-lg max-w-none mb-8">
                                          <h2 className="text-2xl font-bold text-gray-900 mb-4">About {therapist.name.split(' ')[0]}</h2>
                                          {therapist.fullBio.split('\n\n').map((paragraph, index) => (
                                                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                                                      {paragraph}
                                                </p>
                                          ))}
                                    </div>
                              </div>

                              {/* Contact Form */}
                              <div className="bg-gray-50 rounded-lg p-8">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                                          Schedule with {therapist.name.split(' ')[0]}
                                    </h2>
                                    <p className="text-gray-600 text-center mb-8">
                                          Fill out the form below and we'll get back to you within 1-2 business days.
                                    </p>

                                    {submitMessage && (
                                          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
                                                {submitMessage}
                                          </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                          <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                                            First Name <span className="text-red-500">*</span>
                                                      </label>
                                                      <input
                                                            type="text"
                                                            id="firstName"
                                                            name="firstName"
                                                            required
                                                            value={formData.firstName}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                      />
                                                </div>

                                                <div>
                                                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                                            Last Name <span className="text-red-500">*</span>
                                                      </label>
                                                      <input
                                                            type="text"
                                                            id="lastName"
                                                            name="lastName"
                                                            required
                                                            value={formData.lastName}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                      />
                                                </div>
                                          </div>

                                          <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                            Email Address <span className="text-red-500">*</span>
                                                      </label>
                                                      <input
                                                            type="email"
                                                            id="email"
                                                            name="email"
                                                            required
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                      />
                                                </div>

                                                <div>
                                                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                                            Phone Number <span className="text-red-500">*</span>
                                                      </label>
                                                      <input
                                                            type="tel"
                                                            id="phone"
                                                            name="phone"
                                                            required
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                      />
                                                </div>
                                          </div>

                                          <div>
                                                <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 mb-2">
                                                      Insurance Carrier <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                      id="insurance"
                                                      name="insurance"
                                                      required
                                                      value={formData.insurance}
                                                      onChange={handleChange}
                                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                >
                                                      <option value="">Select your insurance</option>
                                                      {insuranceProviders.map((provider) => (
                                                            <option key={provider} value={provider}>
                                                                  {provider}
                                                            </option>
                                                      ))}
                                                      <option value="other">Other</option>
                                                </select>
                                          </div>

                                          <div>
                                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                                      Brief description of why you are seeking services <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                      id="description"
                                                      name="description"
                                                      required
                                                      rows={4}
                                                      value={formData.description}
                                                      onChange={handleChange}
                                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                />
                                          </div>

                                          <div>
                                                <label htmlFor="requestedTherapist" className="block text-sm font-medium text-gray-700 mb-2">
                                                      Therapist Requested
                                                </label>
                                                <input
                                                      type="text"
                                                      id="requestedTherapist"
                                                      name="requestedTherapist"
                                                      value={formData.requestedTherapist}
                                                      readOnly
                                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                                />
                                          </div>

                                          <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                          >
                                                {isSubmitting ? 'Sending...' : 'Send Message'}
                                          </button>
                                    </form>
                              </div>
                        </div>
                  </div>
            </div>
      );
}
