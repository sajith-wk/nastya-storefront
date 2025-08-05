"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { sendContactForm } from "@/app/actions/contact"

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(sendContactForm, {
    success: false,
    message: "",
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <p className="mb-6 text-muted-foreground">
          Have a question or want to inquire about an artwork? Fill out the form below, and we'll get back to you as
          soon as possible.
        </p>
        <form action={formAction} className="grid gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <Input id="name" name="name" type="text" placeholder="Your Name" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input id="email" name="email" type="email" placeholder="your@example.com" required />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <Input id="subject" name="subject" type="text" placeholder="Subject of your message" required />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <Textarea id="message" name="message" placeholder="Your message..." rows={5} required />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Sending..." : "Send Message"}
          </Button>
          {state.message && (
            <p className={`mt-4 text-center ${state.success ? "text-green-600" : "text-red-600"}`}>{state.message}</p>
          )}
        </form>
      </div>
    </div>
  )
}
