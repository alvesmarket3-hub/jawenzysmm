/*
# Auto-create profile on signup

1. Changes
- Creates a trigger function `handle_new_user()` that inserts a row into `profiles`
  using the new auth user's id, email, and a derived username.
- Attaches the function to the `on_auth_user_created` event so every new signup
  automatically gets a profile row with balance 0 and role 'user'.

2. Security
- The function runs with SECURITY DEFINER so it can insert into `profiles`
  even though the caller (anon role during signup) cannot.
- Search path set to safe schema.
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username)
  VALUES (NEW.id, NEW.email, split_part(NEW.email, '@', 1))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
