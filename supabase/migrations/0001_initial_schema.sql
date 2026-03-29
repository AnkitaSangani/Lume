-- 1. Create users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  daily_step_goal INT DEFAULT 10000,
  daily_water_ml INT DEFAULT 3500,
  insight_engine BOOLEAN DEFAULT true,
  height_cm INT,
  current_weight_kg NUMERIC(5,2),
  target_weight_kg NUMERIC(5,2),
  is_onboarded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own profile"
  ON public.users FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. Create daily_metrics table
CREATE TABLE public.daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  weight_kg NUMERIC(5,2),
  body_fat_pct NUMERIC(4,2),
  water_intake_ml INT DEFAULT 0,
  steps INT DEFAULT 0,
  rpe_score INT CHECK (rpe_score >= 1 AND rpe_score <= 10),
  UNIQUE(user_id, date)
);

ALTER TABLE public.daily_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own daily metrics"
  ON public.daily_metrics FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Create medications table
CREATE TABLE public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  time_of_day TIME NOT NULL,
  pills_remaining INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_medications_user_id ON public.medications(user_id);

ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own medications"
  ON public.medications FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Create medication_logs table
CREATE TABLE public.medication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  med_id UUID REFERENCES public.medications(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('taken', 'missed', 'pending')) NOT NULL DEFAULT 'pending',
  UNIQUE(med_id, date)
);

CREATE INDEX idx_medication_logs_med_id ON public.medication_logs(med_id);

ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage logs for their medications"
  ON public.medication_logs FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.medications m
    WHERE m.id = public.medication_logs.med_id
      AND m.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.medications m
    WHERE m.id = public.medication_logs.med_id
      AND m.user_id = auth.uid()
  ));

-- 5. Create food_logs table
CREATE TABLE public.food_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  image_url TEXT,
  description TEXT,
  calories INT DEFAULT 0,
  protein_g INT DEFAULT 0,
  carbs_g INT DEFAULT 0,
  fats_g INT DEFAULT 0
);

CREATE INDEX idx_food_logs_user_id_date ON public.food_logs(user_id, created_at DESC);

ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own food logs"
  ON public.food_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
