import type { FormEvent } from "react";

import { useState } from "react";

import { PORTFOLIO_EMAIL } from "@/util/constants.ts";

/**
 * ContactEmailForm - Email contact form for portfolio
 *
 * This is a placeholder component that will be enhanced with full functionality.
 * Currently displays a basic form structure.
 */
const ContactEmailForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    message: "",
    name: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.message.trim() !== "";

  return (
    <form
      id="contact-email-form"
      className="form-boxshadow mx-auto my-8 w-full max-w-sm rounded-md bg-gray-200 px-4 py-6 dark:bg-gray-900"
      method="POST"
      onSubmit={handleSubmit}
    >
      <fieldset className="space-y-4">
        <legend className="sr-only">Contact Form</legend>

        {/* Name Field */}
        <div>
          <label
            className="mb-1 block font-bold text-gray-800 dark:text-gray-200"
            htmlFor="contactName"
          >
            Name <span className="text-purple-700 dark:text-purple-400">*</span>
          </label>
          <input
            id="contactName"
            className="form-input w-full rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        {/* Email Field */}
        <div>
          <label
            className="mb-1 block font-bold text-purple-700 dark:text-purple-400"
            htmlFor="contactEmail"
          >
            Email <span>*</span>
          </label>
          <input
            id="contactEmail"
            className="form-input w-full rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="beammeup@scotty.com"
            required
            aria-required="true"
          />
          <input type="hidden" name="to" value={PORTFOLIO_EMAIL} />
        </div>

        {/* Message Field */}
        <div>
          <label
            className="mb-1 block font-bold text-gray-800 dark:text-gray-200"
            htmlFor="contactMessage"
          >
            Message{" "}
            <span className="text-purple-700 dark:text-purple-400">*</span>
          </label>
          <textarea
            id="contactMessage"
            className="form-textarea h-32 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center">
          <button
            type="submit"
            disabled={!isFormValid}
            className="cursor-pointer rounded-lg bg-purple-700 px-6 py-2 text-white transition-all duration-200 ease-in-out hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-purple-400 dark:hover:bg-purple-300 dark:focus:ring-offset-gray-900"
          >
            Send Email
          </button>
        </div>
      </fieldset>
    </form>
  );
};

export default ContactEmailForm;
