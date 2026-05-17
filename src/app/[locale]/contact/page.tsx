import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import { ContactForm } from './ContactForm'
import { getSiteSettings } from '@/sanity/lib/queries'
import { getLocaleText, buildWhatsAppUrl } from '@/lib/utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ar' ? 'تواصل معنا' : 'Contact',
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as 'en' | 'ar'
  const t = await getTranslations({ locale: loc })
  const settings = await getSiteSettings()

  const address = getLocaleText(settings?.contactInfo?.address, loc) ??
    (loc === 'ar' ? 'مدينة الكويت، الكويت' : 'Kuwait City, Kuwait')
  const phone = settings?.contactInfo?.phone ?? '+965 2222 3333'
  const email = settings?.contactInfo?.email ?? 'info@elevate-learning.com'
  const whatsapp = settings?.contactInfo?.whatsapp ?? '96522223333'
  const whatsAppUrl = buildWhatsAppUrl(whatsapp, t('contact.whatsappMessage'))

  const contactItems = [
    {
      icon: Phone,
      label: t('contact.phone'),
      value: phone,
      href: `tel:${phone}`,
    },
    {
      icon: MessageCircle,
      label: t('contact.whatsapp'),
      value: whatsapp,
      href: whatsAppUrl,
    },
    {
      icon: Mail,
      label: t('contact.email'),
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: MapPin,
      label: t('contact.address'),
      value: address,
      href: `https://maps.google.com/?q=${encodeURIComponent(address)}`,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="hero-gradient border-b border-brand-100 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {t('contact.infoTitle')}
            </h2>
            {contactItems.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-100 transition-colors flex-shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                    {label}
                  </p>
                  <p className="text-sm font-medium text-gray-800">{value}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {loc === 'ar' ? 'أرسل رسالة' : 'Send us a Message'}
            </h2>
            <ContactForm locale={loc} />
          </div>
        </div>
      </div>
    </div>
  )
}
