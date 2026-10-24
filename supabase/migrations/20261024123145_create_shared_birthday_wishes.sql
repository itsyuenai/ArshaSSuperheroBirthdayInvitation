/*
# Create shared birthday guestbook

1. New Tables
- `birthday_wishes` stores public birthday messages for Arsha's invitation.
- `id` is a generated UUID primary key.
- `guest_name` stores the visitor's displayed name.
- `message` stores the birthday wish text.
- `created_at` stores the submission time for newest-first ordering.

2. Security
- Row Level Security is enabled on `birthday_wishes`.
- Anonymous and signed-in visitors may read and create messages because this is an intentionally shared, public guestbook.
- Update and delete access is not granted to browser roles, so submitted wishes cannot be edited or removed through the invitation.

3. Important Notes
- This table is single-tenant and does not use accounts or ownership columns.
- Input length limits are enforced at the database boundary as a final safeguard.
*/

CREATE TABLE IF NOT EXISTS public.birthday_wishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL CHECK (char_length(guest_name) BETWEEN 1 AND 80),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 500),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.birthday_wishes ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON public.birthday_wishes TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can read birthday wishes" ON public.birthday_wishes;
CREATE POLICY "Anyone can read birthday wishes"
ON public.birthday_wishes FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Anyone can add birthday wishes" ON public.birthday_wishes;
CREATE POLICY "Anyone can add birthday wishes"
ON public.birthday_wishes FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Browser cannot update birthday wishes" ON public.birthday_wishes;
DROP POLICY IF EXISTS "Browser cannot delete birthday wishes" ON public.birthday_wishes;
