'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
      const router = useRouter();
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
      const [success, setSuccess] = useState('');

      const handleSignup = async (e: React.FormEvent) => {
            e.preventDefault();
            setError('');
            setSuccess('');

            // Basic validation
            if (!email || !password || !confirmPassword) {
                  setError('Please fill in all fields');
                  return;
            }

            if (password !== confirmPassword) {
                  setError('Passwords do not match');
                  return;
            }

            if (password.length < 6) {
                  setError('Password must be at least 6 characters');
                  return;
            }

            setLoading(true);

            try {
                  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                  if (userCredential.user) {
                        setSuccess('Account created successfully! Redirecting to dashboard...');
                        setTimeout(() => {
                              router.push('/admin/dashboard');
                              router.refresh();
                        }, 1500);
                  }
            } catch (err) {
                  setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center py-12 px-4">
                  <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                              Create Admin Account
                        </h1>
                        <p className="text-gray-600 text-center mb-8">
                              Diversified Psychological Services
                        </p>

                        {error && (
                              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                                    {error}
                              </div>
                        )}

                        {success && (
                              <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                                    {success}
                              </div>
                        )}

                        <form onSubmit={handleSignup} className="space-y-6">
                              <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                          Email Address
                                    </label>
                                    <input
                                          type="email"
                                          id="email"
                                          value={email}
                                          onChange={(e) => setEmail(e.target.value)}
                                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                          required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                          Use your practice email address
                                    </p>
                              </div>

                              <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                          Password
                                    </label>
                                    <input
                                          type="password"
                                          id="password"
                                          value={password}
                                          onChange={(e) => setPassword(e.target.value)}
                                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                          required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                          At least 6 characters
                                    </p>
                              </div>

                              <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                          Confirm Password
                                    </label>
                                    <input
                                          type="password"
                                          id="confirmPassword"
                                          value={confirmPassword}
                                          onChange={(e) => setConfirmPassword(e.target.value)}
                                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                          required
                                    />
                              </div>

                              <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-center"
                              >
                                    {loading ? 'Creating account...' : 'Create Account'}
                              </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                              <p className="text-sm text-gray-600 text-center">
                                    Already have an account?{' '}
                                    <a href="/admin/login" className="text-primary-600 hover:underline font-medium">
                                          Sign in here
                                    </a>
                              </p>
                        </div>
                  </div>
            </div>
      );
}
