'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RegistrationModal } from '@/components/forms/RegistrationModal'
import type { SanitySchedule } from '@/types/sanity'
import { GraduationCap } from 'lucide-react'

interface EnrollButtonProps {
  locale: 'en' | 'ar'
  courseId: string
  courseName: string
  schedules?: SanitySchedule[]
  label: string
  size?: 'default' | 'lg' | 'xl'
}

export function EnrollButton({
  locale,
  courseId,
  courseName,
  schedules,
  label,
  size = 'lg',
}: EnrollButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button size={size} onClick={() => setOpen(true)} className="gap-2">
        <GraduationCap className="h-5 w-5" />
        {label}
      </Button>
      <RegistrationModal
        open={open}
        onClose={() => setOpen(false)}
        locale={locale}
        courseId={courseId}
        courseName={courseName}
        schedules={schedules}
      />
    </>
  )
}
