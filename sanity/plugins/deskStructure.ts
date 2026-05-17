import type { StructureBuilder, StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // ── Site Settings (Singleton) ──────────────────────────────────────
      S.listItem()
        .title('⚙️ Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),

      S.divider(),

      // ── Courses & Instructors ──────────────────────────────────────────
      S.listItem()
        .title('📚 Courses & Instructors')
        .child(
          S.list()
            .title('Courses & Instructors')
            .items([
              S.listItem()
                .title('Courses')
                .schemaType('course')
                .child(S.documentTypeList('course').title('Courses')),
              S.listItem()
                .title('Instructors')
                .schemaType('instructor')
                .child(S.documentTypeList('instructor').title('Instructors')),
              S.listItem()
                .title('Schedules')
                .schemaType('schedule')
                .child(S.documentTypeList('schedule').title('Schedules')),
            ])
        ),

      // ── Content ────────────────────────────────────────────────────────
      S.listItem()
        .title('✍️ Content')
        .child(
          S.list()
            .title('Content')
            .items([
              S.listItem()
                .title('Blog Posts')
                .schemaType('blog')
                .child(S.documentTypeList('blog').title('Blog Posts')),
              S.listItem()
                .title('Testimonials')
                .schemaType('testimonial')
                .child(S.documentTypeList('testimonial').title('Testimonials')),
              S.listItem()
                .title('Team Members')
                .schemaType('teamMember')
                .child(S.documentTypeList('teamMember').title('Team Members')),
            ])
        ),

      S.divider(),

      // ── Registrations ──────────────────────────────────────────────────
      S.listItem()
        .title('📋 Registrations')
        .child(
          S.list()
            .title('Registrations')
            .items([
              S.listItem()
                .title('🕐 Pending')
                .child(
                  S.documentTypeList('registration')
                    .title('Pending Registrations')
                    .filter('_type == "registration" && status == "pending"')
                    .canHandleIntent((intent) => intent !== 'create')
                ),
              S.listItem()
                .title('✅ Confirmed')
                .child(
                  S.documentTypeList('registration')
                    .title('Confirmed Registrations')
                    .filter('_type == "registration" && status == "confirmed"')
                    .canHandleIntent((intent) => intent !== 'create')
                ),
              S.listItem()
                .title('💰 Paid')
                .child(
                  S.documentTypeList('registration')
                    .title('Paid Registrations')
                    .filter('_type == "registration" && status == "paid"')
                    .canHandleIntent((intent) => intent !== 'create')
                ),
              S.listItem()
                .title('All Registrations')
                .child(
                  S.documentTypeList('registration')
                    .title('All Registrations')
                    .canHandleIntent((intent) => intent !== 'create')
                ),
            ])
        ),
    ])
