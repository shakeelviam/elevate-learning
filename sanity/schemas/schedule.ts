import { defineField, defineType } from 'sanity'

export const scheduleSchema = defineType({
  name: 'schedule',
  title: 'Schedule',
  type: 'document',
  fields: [
    defineField({
      name: 'course',
      title: 'Course',
      type: 'reference',
      to: [{ type: 'course' }],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
    }),

    defineField({
      name: 'days',
      title: 'Days of Week',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Sunday', value: 'Sunday' },
          { title: 'Monday', value: 'Monday' },
          { title: 'Tuesday', value: 'Tuesday' },
          { title: 'Wednesday', value: 'Wednesday' },
          { title: 'Thursday', value: 'Thursday' },
          { title: 'Friday', value: 'Friday' },
          { title: 'Saturday', value: 'Saturday' },
        ],
        layout: 'grid',
      },
    }),

    defineField({
      name: 'time',
      title: 'Time (e.g. 5:00 PM – 7:00 PM)',
      type: 'string',
    }),

    defineField({
      name: 'location',
      title: 'Location Type',
      type: 'string',
      options: {
        list: [
          { title: 'Physical (In-Person)', value: 'physical' },
          { title: 'Online (Zoom/Live)', value: 'online' },
        ],
        layout: 'radio',
      },
      initialValue: 'physical',
    }),

    defineField({
      name: 'locationDetails',
      title: 'Location Details',
      type: 'string',
      description: 'Room number, Zoom link (will be sent after registration), etc.',
    }),

    defineField({
      name: 'capacity',
      title: 'Capacity (max students)',
      type: 'number',
      validation: (rule) => rule.min(1),
    }),

    defineField({
      name: 'enrolledCount',
      title: 'Enrolled Count',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.min(0),
    }),
  ],

  preview: {
    select: {
      courseTitle: 'course.title.en',
      startDate: 'startDate',
      location: 'location',
    },
    prepare({ courseTitle, startDate, location }) {
      return {
        title: courseTitle || 'Schedule',
        subtitle: `${startDate} · ${location}`,
      }
    },
  },
})
