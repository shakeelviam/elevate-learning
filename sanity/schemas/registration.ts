import { defineField, defineType } from 'sanity'

/**
 * Registration Schema
 *
 * This document type captures course interest submissions.
 * It is intentionally kept minimal for Phase 1.
 *
 * FUTURE HOOKS (Phase 2 — Payment):
 * - Add `paymentId` field to store MyFatoorah transaction ID
 * - Add `paymentStatus` field ('unpaid' | 'paid' | 'refunded')
 * - Add `invoiceUrl` field
 *
 * FUTURE HOOKS (Phase 3 — LMS):
 * - Add `lmsUserId` field (reference to LMS user once provisioned)
 * - Add `courseAccessGranted` boolean
 * - Add `enrollmentDate` datetime
 */
export const registrationSchema = defineType({
  name: 'registration',
  title: 'Registration',
  type: 'document',
  // Disable create/delete from studio — created only via API
  __experimental_actions: ['update', 'publish', 'unpublish'],
  fields: [
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      readOnly: true,
    }),

    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      readOnly: true,
    }),

    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      readOnly: true,
    }),

    defineField({
      name: 'course',
      title: 'Course',
      type: 'reference',
      to: [{ type: 'course' }],
      readOnly: true,
    }),

    defineField({
      name: 'schedule',
      title: 'Preferred Schedule',
      type: 'reference',
      to: [{ type: 'schedule' }],
      readOnly: true,
    }),

    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 3,
      readOnly: true,
    }),

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: '🕐 Pending', value: 'pending' },
          { title: '✅ Confirmed', value: 'confirmed' },
          { title: '❌ Cancelled', value: 'cancelled' },
          { title: '💰 Paid', value: 'paid' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),

    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      readOnly: true,
    }),

    // ── Phase 2: Payment Hook ──────────────────────────────────────────
    // Uncomment when integrating MyFatoorah:
    //
    // defineField({
    //   name: 'paymentId',
    //   title: 'MyFatoorah Payment ID',
    //   type: 'string',
    // }),
    //
    // defineField({
    //   name: 'paymentStatus',
    //   title: 'Payment Status',
    //   type: 'string',
    //   options: {
    //     list: ['unpaid', 'paid', 'refunded', 'failed'],
    //   },
    //   initialValue: 'unpaid',
    // }),

    // ── Phase 3: LMS Hook ─────────────────────────────────────────────
    // Uncomment when integrating LMS:
    //
    // defineField({
    //   name: 'lmsUserId',
    //   title: 'LMS User ID',
    //   type: 'string',
    // }),
    //
    // defineField({
    //   name: 'courseAccessGranted',
    //   title: 'Course Access Granted',
    //   type: 'boolean',
    //   initialValue: false,
    // }),
  ],

  orderings: [
    {
      title: 'Submission Date (Newest)',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
    {
      title: 'Status',
      name: 'status',
      by: [{ field: 'status', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'fullName',
      subtitle: 'email',
      status: 'status',
    },
    prepare({ title, subtitle, status }) {
      const statusEmoji =
        status === 'pending'
          ? '🕐'
          : status === 'confirmed'
          ? '✅'
          : status === 'paid'
          ? '💰'
          : '❌'
      return {
        title: title || 'Unknown',
        subtitle: `${statusEmoji} ${subtitle || ''}`,
      }
    },
  },
})
