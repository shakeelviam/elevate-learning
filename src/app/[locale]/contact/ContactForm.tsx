'use client'

import { useActionState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/useToast'
import { sendContactAction, type ContactActionState } from './actions'

interface ContactFormProps {
  locale: 'en' | 'ar'
}

const initialState: ContactActionState = { success: false }

export function ContactForm({ locale }: ContactFormProps) {
  const t = useTranslations()
  const [state, formAction, isPending] = useActionState(sendContactAction, initialState)

  useEffect(() => {
    if (state.success) {
      toast({
        variant: 'success',
        title: t('contact.successTitle'),
        description: t('contact.successMessage'),
      })
    }
    if (state.error) {
      toast({
        variant: 'destructive',
        title: locale === 'ar' ? 'حدث خطأ' : 'Error',
        description: state.error,
      })
    }
  }, [state])

  if (state.success) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {t('contact.successTitle')}
        </h3>
        <p className="text-gray-500">{t('contact.successMessage')}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">{t('forms.name')} *</Label>
          <Input
            id="name"
            name="name"
            placeholder={t('forms.namePlaceholder')}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">{t('forms.email')} *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t('forms.emailPlaceholder')}
            dir="ltr"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subject">{t('forms.subject')}</Label>
        <Input
          id="subject"
          name="subject"
          placeholder={t('forms.subjectPlaceholder')}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">{t('forms.message')} *</Label>
        <Textarea
          id="message"
          name="message"
          placeholder={t('forms.messagePlaceholder')}
          rows={5}
          required
        />
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto" isLoading={isPending}>
        <Send className="h-4 w-4" />
        {t('buttons.send')}
      </Button>
    </form>
  )
}
