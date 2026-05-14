'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { CheckCircle2, AlertCircle, Info } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { registrationSchema, type RegistrationFormData } from '@/lib/validations'
import { toast } from '@/hooks/useToast'
import type { SanitySchedule } from '@/types/sanity'
import { formatDate, getLocationLabel } from '@/lib/utils'

interface RegistrationModalProps {
  open: boolean
  onClose: () => void
  locale: 'en' | 'ar'
  courseId: string
  courseName: string
  schedules?: SanitySchedule[]
}

export function RegistrationModal({
  open,
  onClose,
  locale,
  courseId,
  courseName,
  schedules = [],
}: RegistrationModalProps) {
  const t = useTranslations()
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const isRtl = locale === 'ar'

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      courseId,
      locale,
    },
  })

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Request failed')

      setSubmitted(true)
      toast({
        variant: 'success',
        title: t('registration.successTitle'),
        description: t('registration.successMessage'),
      })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: locale === 'ar' ? 'حدث خطأ' : 'Error',
        description: t('errors.submitFailed'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      reset()
      setSubmitted(false)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {submitted ? t('registration.successTitle') : t('registration.title')}
          </DialogTitle>
          <DialogDescription>
            {submitted
              ? t('registration.successMessage')
              : `${t('registration.subtitle')} — ${courseName}`}
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="pt-4">
          {submitted ? (
            <div className="text-center py-8">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('registration.successTitle')}
              </h3>
              <p className="text-gray-500 mb-6">{t('registration.successMessage')}</p>
              <Button onClick={handleClose} variant="outline">
                {t('buttons.close')}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Note banner */}
              <div className="flex items-start gap-2 rounded-xl bg-gold-50 border border-gold-200 p-3 text-sm text-gold-800">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                {t('registration.note')}
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName">{t('forms.fullName')} *</Label>
                <Input
                  id="fullName"
                  placeholder={t('forms.fullNamePlaceholder')}
                  error={errors.fullName?.message}
                  {...register('fullName')}
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email">{t('forms.email')} *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('forms.emailPlaceholder')}
                  dir="ltr"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phone">{t('forms.phone')} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t('forms.phonePlaceholder')}
                  dir="ltr"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
              </div>

              {/* Schedule select */}
              <div className="space-y-1.5">
                <Label>{t('forms.schedule')}</Label>
                <Select onValueChange={(val) => setValue('scheduleId', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      schedules.length > 0
                        ? t('forms.selectSchedule')
                        : t('forms.noSchedules')
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {schedules.length === 0 ? (
                      <SelectItem value="none" disabled>
                        {t('courses.noSchedules')}
                      </SelectItem>
                    ) : (
                      schedules.map((s) => (
                        <SelectItem key={s._id} value={s._id}>
                          {formatDate(s.startDate, locale)} · {getLocationLabel(s.location, locale)}
                          {s.time ? ` · ${s.time}` : ''}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <Label htmlFor="message">{t('forms.message')}</Label>
                <Textarea
                  id="message"
                  rows={3}
                  placeholder={t('forms.messagePlaceholder')}
                  error={errors.message?.message}
                  {...register('message')}
                />
              </div>

              {/* Hidden fields */}
              <input type="hidden" {...register('courseId')} />
              <input type="hidden" {...register('locale')} />

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  {t('buttons.cancel')}
                </Button>
                <Button type="submit" isLoading={isLoading}>
                  {t('buttons.submitInterest')}
                </Button>
              </div>
            </form>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
