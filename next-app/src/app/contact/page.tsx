'use client';

import { FormEvent, useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Submission failed');
      }
      setSubmitted(true);
    } catch (error) {
      setErrorMessage('We could not send your message. Please try again or email sales@astrabiocare.com.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-semibold mb-4">Contact &amp; Bulk Enquiries</h1>
      <p className="mb-6">For quotes, distribution partnerships, or regulatory documents, reach out to our team.</p>
      {submitted ? (
        <p className="text-success" role="status">Thank you. We will respond within 2 business days.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input id="name" name="name" autoComplete="name" className="w-full rounded-md border px-3 py-2" required />
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" className="w-full rounded-md border px-3 py-2" required />
          </div>
          <div className="space-y-1">
            <label htmlFor="phone" className="text-sm font-medium">Phone</label>
            <input id="phone" name="phone" autoComplete="tel" className="w-full rounded-md border px-3 py-2" />
          </div>
          <div className="space-y-1">
            <label htmlFor="company" className="text-sm font-medium">Company</label>
            <input id="company" name="company" autoComplete="organization" className="w-full rounded-md border px-3 py-2" />
          </div>
          <input
            type="text"
            name="companyWebsite"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          <div className="space-y-1">
            <label htmlFor="message" className="text-sm font-medium">Message</label>
            <textarea id="message" name="message" className="w-full rounded-md border px-3 py-2" rows={4} required />
          </div>
          {errorMessage ? (
            <p className="text-sm text-danger" role="alert">{errorMessage}</p>
          ) : null}
          <button type="submit" disabled={isSubmitting} className="rounded-md bg-primary px-5 py-2 text-white disabled:opacity-60">
            {isSubmitting ? 'Sending…' : 'Send'}
          </button>
          <p className="text-xs text-gray-600">We respond within 2 business days. Your information is kept confidential.</p>
        </form>
      )}
    </div>
  );
}
