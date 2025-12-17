import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { EnvelopeSimple, MapPin, Phone, LinkedinLogo } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { contactConfig, getEmailUrl } from '@/lib/contact-config'

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Message sent successfully! We\'ll get back to you soon.')
    setFormData({
      name: '',
      email: '',
      company: '',
      subject: '',
      message: ''
    })
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-28 px-8 overflow-hidden">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold text-foreground mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Have a question about our advanced polymers or want to discuss a custom application? 
              We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full shadow-lg">
                <CardHeader>
                  <CardTitle className="text-3xl">Send us a message</CardTitle>
                  <CardDescription className="text-base">
                    Fill out the form below and we'll respond within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base font-semibold">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Smith"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base font-semibold">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-base font-semibold">Company / Organization</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your organization"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-base font-semibold">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="What can we help you with?"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-base font-semibold">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        className="resize-none"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full font-semibold" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-3xl">Contact Information</CardTitle>
                  <CardDescription className="text-base">
                    Reach out to us through any of these channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <EnvelopeSimple size={24} className="text-primary" weight="bold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1.5">General Enquiries</h3>
                      <a 
                        href={getEmailUrl('general')}
                        onClick={(e) => {
                          e.preventDefault()
                          window.location.href = getEmailUrl('general')
                        }}
                        className="text-muted-foreground hover:text-primary transition-colors cursor-pointer font-medium"
                      >
                        {contactConfig.email.general}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <EnvelopeSimple size={24} className="text-primary" weight="bold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1.5">Quote Requests</h3>
                      <a 
                        href={getEmailUrl('sales')}
                        onClick={(e) => {
                          e.preventDefault()
                          window.location.href = getEmailUrl('sales')
                        }}
                        className="text-muted-foreground hover:text-primary transition-colors cursor-pointer font-medium"
                      >
                        {contactConfig.email.sales}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <MapPin size={24} className="text-primary" weight="bold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1.5">Location</h3>
                      <p className="text-muted-foreground font-medium leading-relaxed">
                        {contactConfig.address.street}<br />
                        {contactConfig.address.city} {contactConfig.address.postcode}<br />
                        {contactConfig.address.country}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <LinkedinLogo size={24} className="text-primary" weight="bold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1.5">LinkedIn</h3>
                      <a 
                        href={contactConfig.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors font-medium"
                      >
                        Connect with us on LinkedIn
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20 shadow-lg">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-foreground mb-3 text-xl">
                    Looking for technical support?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    For technical inquiries about our materials, datasheets, or custom applications, 
                    please include relevant details in your message above.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
