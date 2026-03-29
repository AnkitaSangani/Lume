export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          daily_step_goal: number | null
          daily_water_ml: number | null
          insight_engine: boolean | null
          height_cm: number | null
          current_weight_kg: number | null
          target_weight_kg: number | null
          is_onboarded: boolean | null
        }
        Insert: {
          id: string
          daily_step_goal?: number | null
          daily_water_ml?: number | null
          insight_engine?: boolean | null
          height_cm?: number | null
          current_weight_kg?: number | null
          target_weight_kg?: number | null
          is_onboarded?: boolean | null
        }
        Update: {
          id?: string
          daily_step_goal?: number | null
          daily_water_ml?: number | null
          insight_engine?: boolean | null
          height_cm?: number | null
          current_weight_kg?: number | null
          target_weight_kg?: number | null
          is_onboarded?: boolean | null
        }
      }
      daily_metrics: {
        Row: {
          id: string
          user_id: string
          date: string
          weight_kg: number | null
          body_fat_pct: number | null
          water_intake_ml: number | null
          steps: number | null
          rpe_score: number | null
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          weight_kg?: number | null
          body_fat_pct?: number | null
          water_intake_ml?: number | null
          steps?: number | null
          rpe_score?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          weight_kg?: number | null
          body_fat_pct?: number | null
          water_intake_ml?: number | null
          steps?: number | null
          rpe_score?: number | null
        }
      }
      medications: {
        Row: {
          id: string
          user_id: string
          name: string
          time_of_day: string
          pills_remaining: number | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          time_of_day: string
          pills_remaining?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          time_of_day?: string
          pills_remaining?: number | null
        }
      }
      medication_logs: {
        Row: {
          id: string
          med_id: string
          date: string
          status: 'taken' | 'missed' | 'pending'
        }
        Insert: {
          id?: string
          med_id: string
          date: string
          status?: 'taken' | 'missed' | 'pending'
        }
        Update: {
          id?: string
          med_id?: string
          date?: string
          status?: 'taken' | 'missed' | 'pending'
        }
      }
      food_logs: {
        Row: {
          id: string
          user_id: string
          created_at: string | null
          image_url: string | null
          description: string | null
          calories: number | null
          protein_g: number | null
          carbs_g: number | null
          fats_g: number | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string | null
          image_url?: string | null
          description?: string | null
          calories?: number | null
          protein_g?: number | null
          carbs_g?: number | null
          fats_g?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string | null
          image_url?: string | null
          description?: string | null
          calories?: number | null
          protein_g?: number | null
          carbs_g?: number | null
          fats_g?: number | null
        }
      }
      food_library: {
        Row: {
          id: string
          user_id: string
          name: string
          calories: number | null
          protein_g: number | null
          carbs_g: number | null
          fats_g: number | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          calories?: number | null
          protein_g?: number | null
          carbs_g?: number | null
          fats_g?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          calories?: number | null
          protein_g?: number | null
          carbs_g?: number | null
          fats_g?: number | null
        }
      }
    }
  }
}
