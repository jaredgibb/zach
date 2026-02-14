'use client';

import { useState } from 'react';
import { businessInfo, insuranceProviders, therapists } from '@/lib/data';

export default function ContactPage() {
      const [isMinor, setIsMinor] = useState(false);
      const [formData, setFormData] = useState({
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            city: '',
            state: '',
            zip: '',
            age: '',
            insurance: '',
            otherInsurance: '',
            requestedTherapist: '',
      });

      const [isSubmitting, setIsSubmitting] = useState(false);
      const [submitMessage, setSubmitMessage] = useState('');

      const ageRangesMinor = ['0-5', '6-10', '11-13', '14-17'];
      const ageRangesAdult = ['18-21', '22-40', '41-65', '65+'];

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
                        phone: '',
                        email: '',
                        city: '',
                        state: '',
                        zip: '',
                        age: '',
                        insurance: '',
                        otherInsurance: '',
                        requestedTherapist: '',
                  });
                  setIsMinor(false);
            }, 1000);
      };

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
      };

      return (
            <div className="py-16">
                  <div className="container-custom">
                        <div className="max-w-3xl mx-auto">
                              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
                                    Contact Us
                              </h1>

                              {/* Business Info */}
                              <div className="bg-primary-50 rounded-lg p-6 mb-8">
                                    <h2 className="text-2xl font-bold text-primary-900 mb-4">
                                          {businessInfo.name}
                                    </h2>
                                    <div className="space-y-2 text-gray-700">
                                          <p>
                                                <strong>Address:</strong><br />
                                                {businessInfo.address}<br />
                                                {businessInfo.city}, {businessInfo.state} {businessInfo.zip}
                                          </p>
                                          <p>
                                                <strong>Phone:</strong>{' '}
                                                <a href={`tel:${businessInfo.phone}`} className="text-primary-600 hover:underline">
                                                      {businessInfo.phone}
                                                </a>
                                          </p>
                                          <p>
                                                <strong>Email:</strong>{' '}
                                                <a href={`mailto:${businessInfo.email}`} className="text-primary-600 hover:underline">
                                                      {businessInfo.email}
                                                </a>
                                          </p>
                                    </div>
                              </div>

                              {/* Emergency Notice */}
                              <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
                                    <h3 className="text-lg font-bold text-red-900 mb-3">
                                          This form is not intended for emergency services
                                    </h3>
                                    <p className="text-red-800 mb-2">
                                          If you are experiencing a mental health emergency:
                                    </p>
                                    <ul className="list-disc list-inside text-red-800 space-y-1">
                                          <li>Dial <strong>988</strong> for the National Suicide and Crisis Lifeline</li>
                                          <li>Dial <strong>911</strong> for Emergency Services or Go to the Nearest Emergency Room</li>
                                    </ul>
                              </div>

                              {/* Contact Form */}
                              <div className="bg-white rounded-lg shadow-md p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                          Request an Appointment
                                    </h2>

                                    {submitMessage && (
                                          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
                                                {submitMessage}
                                          </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                          {/* Name Fields */}
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

                                          {/* Contact Fields */}
                                          <div className="grid md:grid-cols-2 gap-6">
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

                                                <div>
                                                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                            Email <span className="text-red-500">*</span>
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
                                          </div>

                                          {/* Address Fields */}
                                          <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                      Address <span className="text-red-500">*</span>
                                                </label>
                                                <div className="grid md:grid-cols-3 gap-4">
                                                      <div className="md:col-span-2">
                                                            <input
                                                                  type="text"
                                                                  id="city"
                                                                  name="city"
                                                                  placeholder="City"
                                                                  required
                                                                  value={formData.city}
                                                                  onChange={handleChange}
                                                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                            />
                                                      </div>
                                                      <div className="grid grid-cols-2 gap-4">
                                                            <input
                                                                  type="text"
                                                                  id="state"
                                                                  name="state"
                                                                  placeholder="State"
                                                                  required
                                                                  maxLength={2}
                                                                  value={formData.state}
                                                                  onChange={handleChange}
                                                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                            />
                                                            <input
                                                                  type="text"
                                                                  id="zip"
                                                                  name="zip"
                                                                  placeholder="Zip"
                                                                  required
                                                                  maxLength={10}
                                                                  value={formData.zip}
                                                                  onChange={handleChange}
                                                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                            />
                                                      </div>
                                                </div>
                                          </div>

                                          {/* Minor Checkbox */}
                                          <div className="bg-gray-50 p-4 rounded-lg">
                                                <label className="flex items-start cursor-pointer">
                                                      <input
                                                            type="checkbox"
                                                            checked={isMinor}
                                                            onChange={(e) => {
                                                                  setIsMinor(e.target.checked);
                                                                  setFormData({ ...formData, age: '' });
                                                            }}
                                                            className="mt-1 mr-3 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                                      />
                                                      <span className="text-sm text-gray-700">
                                                            This form is intended to be completed by a parent or legal guardian. Minors should not complete this form on their own. Check here if you are the parent or legal guardian of a minor and are inquiring about services for them.
                                                      </span>
                                                </label>
                                          </div>

                                          {/* Age */}
                                          <div>
                                                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                                                      Age Range <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                      id="age"
                                                      name="age"
                                                      required
                                                      value={formData.age}
                                                      onChange={handleChange}
                                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                >
                                                      <option value="">Select age range</option>
                                                      {(isMinor ? ageRangesMinor : ageRangesAdult).map((range) => (
                                                            <option key={range} value={range}>
                                                                  {range}
                                                            </option>
                                                      ))}
                                                </select>
                                          </div>

                                          {/* Insurance */}
                                          <div>
                                                <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 mb-2">
                                                      Insurance/Payer Name <span className="text-red-500">*</span>
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

                                          {/* Other Insurance */}
                                          {formData.insurance === 'other' && (
                                                <div>
                                                      <label htmlFor="otherInsurance" className="block text-sm font-medium text-gray-700 mb-2">
                                                            Please specify your insurance
                                                      </label>
                                                      <input
                                                            type="text"
                                                            id="otherInsurance"
                                                            name="otherInsurance"
                                                            value={formData.otherInsurance}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                      />
                                                </div>
                                          )}

                                          {/* Therapist Request */}
                                          <div>
                                                <label htmlFor="requestedTherapist" className="block text-sm font-medium text-gray-700 mb-2">
                                                      Therapist Requested (Optional)
                                                </label>
                                                <select
                                                      id="requestedTherapist"
                                                      name="requestedTherapist"
                                                      value={formData.requestedTherapist}
                                                      onChange={handleChange}
                                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                >
                                                      <option value="">No preference</option>
                                                      {therapists.map((therapist) => (
                                                            <option key={therapist.id} value={therapist.name}>
                                                                  {therapist.name}, {therapist.credentials}
                                                            </option>
                                                      ))}
                                                </select>
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
