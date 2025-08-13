export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          screenshot_url: string | null
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          screenshot_url?: string | null
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          screenshot_url?: string | null
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_panel: {
        Row: {
          created_at: string
          id: string
          is_admin: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_admin?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_admin?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      device_sessions: {
        Row: {
          created_at: string
          device_fingerprint: string
          expires_at: string
          id: string
          is_active: boolean | null
          session_token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          session_token: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          session_token?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_sessions: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          id: string
          paystack_access_code: string | null
          paystack_reference: string | null
          signup_data: Json | null
          status: string | null
          stripe_session_id: string
          updated_at: string
          user_email: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          id?: string
          paystack_access_code?: string | null
          paystack_reference?: string | null
          signup_data?: Json | null
          status?: string | null
          stripe_session_id: string
          updated_at?: string
          user_email: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          paystack_access_code?: string | null
          paystack_reference?: string | null
          signup_data?: Json | null
          status?: string | null
          stripe_session_id?: string
          updated_at?: string
          user_email?: string
        }
        Relationships: []
      }
      prize_structure: {
        Row: {
          created_at: string
          id: string
          position: number
          prize_amount: number
          prize_description: string
        }
        Insert: {
          created_at?: string
          id?: string
          position: number
          prize_amount: number
          prize_description: string
        }
        Update: {
          created_at?: string
          id?: string
          position?: number
          prize_amount?: number
          prize_description?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_name: string | null
          account_number: string | null
          bank_name: string | null
          created_at: string
          full_name: string | null
          has_attempted_quiz: boolean | null
          id: string
          location: string | null
          payment_verified: boolean | null
          quiz_completed_at: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          created_at?: string
          full_name?: string | null
          has_attempted_quiz?: boolean | null
          id?: string
          location?: string | null
          payment_verified?: boolean | null
          quiz_completed_at?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          created_at?: string
          full_name?: string | null
          has_attempted_quiz?: boolean | null
          id?: string
          location?: string | null
          payment_verified?: boolean | null
          quiz_completed_at?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          category: string | null
          correct_answer: string
          created_at: string
          difficulty_level: string | null
          explanation: string | null
          id: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question_area: string | null
          question_text: string
        }
        Insert: {
          category?: string | null
          correct_answer: string
          created_at?: string
          difficulty_level?: string | null
          explanation?: string | null
          id?: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question_area?: string | null
          question_text: string
        }
        Update: {
          category?: string | null
          correct_answer?: string
          created_at?: string
          difficulty_level?: string | null
          explanation?: string | null
          id?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          question_area?: string | null
          question_text?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          anti_cheat_violations: Json | null
          device_fingerprint: string | null
          id: string
          ip_address: string | null
          quiz_data: Json | null
          score: number
          submitted_at: string
          time_taken: number
          total_questions: number
          user_agent: string | null
          user_id: string
          user_location: string | null
        }
        Insert: {
          anti_cheat_violations?: Json | null
          device_fingerprint?: string | null
          id?: string
          ip_address?: string | null
          quiz_data?: Json | null
          score?: number
          submitted_at?: string
          time_taken: number
          total_questions?: number
          user_agent?: string | null
          user_id: string
          user_location?: string | null
        }
        Update: {
          anti_cheat_violations?: Json | null
          device_fingerprint?: string | null
          id?: string
          ip_address?: string | null
          quiz_data?: Json | null
          score?: number
          submitted_at?: string
          time_taken?: number
          total_questions?: number
          user_agent?: string | null
          user_id?: string
          user_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_quiz_attempts_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      quiz_settings: {
        Row: {
          created_at: string | null
          id: number
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: number
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          id?: number
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      quiz_violations: {
        Row: {
          id: string
          ip_address: string | null
          quiz_attempt_id: string | null
          timestamp: string
          user_agent: string | null
          user_id: string
          violation_details: string | null
          violation_type: string
        }
        Insert: {
          id?: string
          ip_address?: string | null
          quiz_attempt_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id: string
          violation_details?: string | null
          violation_type: string
        }
        Update: {
          id?: string
          ip_address?: string | null
          quiz_attempt_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string
          violation_details?: string | null
          violation_type?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          created_at: string
          id: string
          is_admin_response: boolean | null
          message: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_admin_response?: boolean | null
          message: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_admin_response?: boolean | null
          message?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_show_explanations: {
        Args: { p_user_id?: string }
        Returns: boolean
      }
      get_admin_user_details: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          username: string
          payment_verified: boolean
          has_attempted_quiz: boolean
          quiz_completed_at: string
        }[]
      }
      get_questions_for_review: {
        Args: { p_question_ids: string[] }
        Returns: {
          id: string
          question_text: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          correct_answer: string
          explanation: string
          category: string
        }[]
      }
      get_random_questions_for_user: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          question_text: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          correct_answer: string
          explanation: string
          category: string
          difficulty_level: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
