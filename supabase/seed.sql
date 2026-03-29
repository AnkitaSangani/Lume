-- Seed testing data for Lume PWA

-- Note: In a real Supabase environment, users must exist in auth.users first.
-- For local testing, we might need to create the auth user, but usually 
-- the seed script runs after migrations.
-- We will insert a dummy user directly into auth.users to satisfy the foreign key, 
-- or you can use your real Auth UUID if testing against a live project.
INSERT INTO auth.users (id, email) 
VALUES ('11111111-1111-1111-1111-111111111111', 'test@example.com') 
ON CONFLICT (id) DO NOTHING;

-- Insert user preferences
INSERT INTO public.users (id, daily_step_goal, daily_water_ml, insight_engine) 
VALUES ('11111111-1111-1111-1111-111111111111', 10000, 3500, true)
ON CONFLICT (id) DO NOTHING;

-- Insert 7 days of daily_metrics
INSERT INTO public.daily_metrics (user_id, date, weight_kg, body_fat_pct, water_intake_ml, steps, rpe_score) VALUES 
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 6, 75.5, 15.0, 2000, 8000, 6),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 5, 75.4, 15.0, 3000, 11000, 7),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 4, 75.2, 14.9, 2500, 9500, 5),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 3, 75.1, 14.8, 3500, 10500, 8),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 2, 75.3, 14.9, 1500, 5000, 4),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 1, 75.0, 14.7, 3000, 12000, 6),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE, 74.8, 14.6, 2000, 3000, 5)
ON CONFLICT (user_id, date) DO NOTHING;

-- Insert 2 medications
INSERT INTO public.medications (id, user_id, name, time_of_day, pills_remaining) VALUES 
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Vitamin D', '08:00:00', 30),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Omega 3', '20:00:00', 45)
ON CONFLICT (id) DO NOTHING;

-- Insert medication logs for today
INSERT INTO public.medication_logs (med_id, date, status) VALUES 
('22222222-2222-2222-2222-222222222222', CURRENT_DATE, 'taken'),
('33333333-3333-3333-3333-333333333333', CURRENT_DATE, 'pending');

-- Insert 3 food logs
INSERT INTO public.food_logs (user_id, image_url, description, calories, protein_g, carbs_g, fats_g) VALUES 
('11111111-1111-1111-1111-111111111111', 'https://example.com/egg.jpg', 'Scrambled eggs with toast', 350, 20, 30, 15),
('11111111-1111-1111-1111-111111111111', NULL, 'Protein Shake', 150, 30, 5, 2),
('11111111-1111-1111-1111-111111111111', NULL, 'Grilled chicken salad', 450, 40, 15, 20);

-- Insert 3 food library items
INSERT INTO public.food_library (user_id, name, calories, protein_g, carbs_g, fats_g) VALUES 
('11111111-1111-1111-1111-111111111111', 'Banana', 105, 1, 27, 0),
('11111111-1111-1111-1111-111111111111', 'Chicken Breast (100g)', 165, 31, 0, 3),
('11111111-1111-1111-1111-111111111111', 'Oatmeal (1 cup)', 158, 6, 27, 3);
