'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
      const router = useRouter();
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');

      const handleLogin = async (e: React.FormEvent) => {
            e.preventDefault();
            setError('');
            setLoading(true);

            try {
                  const userCredential = await signInWithEmailAndPassword(auth, email, password);

                  if (userCredential.user) {
                        router.push('/admin/dashboard');
                        router.refresh();
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
                              Admin Portal
                        </h1>
                        <p className="text-gray-600 text-center mb-8">
                              Diversified Psychological Services
                        </p>

                        {error && (
                              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                                    {error}
                              </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
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
                              </div>

                              <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-center"
                              >
                                    {loading ? 'Signing in...' : 'Sign In'}
                              </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                              <p className="text-sm text-gray-600 text-center">
                                    First time logging in?{' '}
                                    <Link href="/admin/signup" className="text-primary-600 hover:underline font-medium">
                                          Sign up here
                                    </Link>
                              </p>
                        </div>
                  </div>
            </div>
      );
}
