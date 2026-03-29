-- Create users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  daily_step_goal INT DEFAULT 10000,
  daily_water_ml INT DEFAULT 3500,
  insight_engine BOOLEAN DEFAULT true
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own profile"
  ON public.users FOR ALL
  USING (auth.uid() = id);

-- Create daily_metrics table
CREATE TABLE public.daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  weight_kg NUMERIC,
  body_fat_pct NUMERIC,
  water_intake_ml INT,
  steps INT,
  rpe_score INT,
  UNIQUE(user_id, date)
);

ALTER TABLE public.daily_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own daily metrics"
  ON public.daily_metrics FOR ALL
  USING (auth.uid() = user_id);

-- Create medications table
CREATE TABLE public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  time_of_day TIME NOT NULL,
  pills_remaining INT
);

ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own medications"
  ON public.medications FOR ALL
  USING (auth.uid() = user_id);

-- Create medication_logs table
CREATE TABLE public.medication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  med_id UUID REFERENCES public.medications(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('taken', 'missed', 'pending')) NOT NULL DEFAULT 'pending'
);

ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage logs for their medications"
  ON public.medication_logs FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.medications m
    WHERE m.id = public.medication_logs.med_id
      AND m.user_id = auth.uid()
  ));

-- Create food_logs table
CREATE TABLE public.food_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  image_url TEXT,
  description TEXT,
  calories INT,
  protein_g INT,
  carbs_g INT,
  fats_g INT
);

ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own food logs"
  ON public.food_logs FOR ALL
  USING (auth.uid() = user_id);

-- Create food_library table
CREATE TABLE public.food_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  calories INT,
  protein_g INT,
  carbs_g INT,
  fats_g INT
);

ALTER TABLE public.food_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own food library items"
  ON public.food_library FOR ALL
  USING (auth.uid() = user_id);
