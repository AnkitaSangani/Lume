-- Append precise new macro context limits resolving Onboarding states
ALTER TABLE users
ADD COLUMN height_cm integer,
ADD COLUMN current_weight_kg numeric,
ADD COLUMN target_weight_kg numeric,
ADD COLUMN is_onboarded boolean DEFAULT false;
