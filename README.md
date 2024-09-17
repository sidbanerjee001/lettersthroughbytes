Program built in Next.JS with a Supabase backend. All work is original and written in TypeScript/JSX.

##  Random Details

All design is original; no UI libraries used. You can probably tell.

No support for images/video. Once I figure out how to store that (probably AWS) and integrate within paragraphs, I might add it.

Markdown libraries don't save newlines, and neither do SQL databases. Integrating images within text fields is perhaps only possible through a pipeline of uploading->retrieving the S3 URL->linking to an IMG element. Well now that I say that it seems trivial...

In any case, content is converted into HTML so its formatting can be preserved when accessed from the database. This limits formatting to fewer options, although in the future I can expand to the potentially-supported variable TailwindCSS class names.

Lightweight and unsecured. RLS disabled and API keys are stored in the Vercel framework. If any GitHub scrapers target my work it might be over, so I'll manually hard-save all content.