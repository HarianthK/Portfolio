"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Github, Linkedin, Mail, MapPin, Send, Copy, Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { Reveal } from "@/components/motion/reveal"

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
      }

      // Create mailto link with form data
      const mailtoLink = `mailto:hkalaval@asu.edu?subject=${encodeURIComponent(data.subject as string)}&body=${encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
      )}`

      // Open email client
      window.location.href = mailtoLink

      setSubmitStatus("success")
      // Reset form
      const form = e.currentTarget
      form.reset()
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus("idle"), 5000)
    }
  }

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText("hkalaval@asu.edu")
    setCopied(true)
    toast.success("Email copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "hkalaval@asu.edu",
      href: "mailto:hkalaval@asu.edu",
      copyable: true,
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Phoenix, Arizona, USA",
      href: "#",
      copyable: false,
    },
  ]

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4 pt-24">
      <div className="max-w-6xl w-full">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Let's Connect
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to discuss AI engineering opportunities? I'm always excited to connect with fellow tech professionals and explore new challenges.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="p-8 border-primary/20 bg-card/50 backdrop-blur-xl hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
              <h3 className="text-2xl font-semibold mb-6 text-primary">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      className="bg-background/50 border-primary/20 focus:border-primary/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      className="bg-background/50 border-primary/20 focus:border-primary/40"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What's this about?"
                    required
                    className="bg-background/50 border-primary/20 focus:border-primary/40"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell me about your project or opportunity..."
                    rows={5}
                    required
                    className="bg-background/50 border-primary/20 focus:border-primary/40 resize-none"
                  />
                </div>

                {/* Status Messages */}
                {submitStatus === "success" && (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                    Your email client should open with the message ready to send. If it doesn't open, please email me directly at hkalaval@asu.edu
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                    Failed to send message. Please try again or contact me directly.
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gap-2 group hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
                <p className="text-xs text-muted-foreground text-center -mt-2">
                  This opens your email app with the message pre-filled — or copy the email address below instead.
                </p>
              </form>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="p-8 border-primary/20 bg-card/50 backdrop-blur-xl hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
                <h3 className="text-2xl font-semibold mb-6 text-primary">Get in Touch</h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors group"
                      >
                        <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">{info.label}</p>
                          <Link
                            href={info.href}
                            className="text-foreground hover:text-primary transition-colors font-medium"
                          >
                            {info.value}
                          </Link>
                        </div>
                        {info.copyable && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleCopyEmail}
                            className="shrink-0 hover:bg-primary/10 hover:text-primary"
                          >
                            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                            <span className="sr-only">Copy email address</span>
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Card>

              {/* Social Links */}
              <Card className="p-8 border-primary/20 bg-card/50 backdrop-blur-xl hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
                <h3 className="text-2xl font-semibold mb-6 text-primary">Follow Me</h3>
                <div className="flex gap-4">
                  <Link
                    href="https://github.com/HarianthK"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-all duration-300 hover:scale-105 flex-1"
                  >
                    <Github className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-medium">GitHub</span>
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/harianthk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-all duration-300 hover:scale-105 flex-1"
                  >
                    <Linkedin className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-medium">LinkedIn</span>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
