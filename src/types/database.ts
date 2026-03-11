export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      options: {
        Row: {
          created_at: string | null
          id: string
          is_correct: boolean
          option_text: string
          question_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_correct?: boolean
          option_text: string
          question_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_correct?: boolean
          option_text?: string
          question_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          created_at: string | null
          id: string
          last_active: string | null
          nickname: string
          score: number | null
          session_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_active?: string | null
          nickname: string
          score?: number | null
          session_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_active?: string | null
          nickname?: string
          score?: number | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          category_id: string | null
          created_at: string | null
          difficulty: "beginner" | "intermediate" | "advanced"
          explanation: string | null
          id: string
          question_text: string
          time_limit_seconds: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          difficulty?: "beginner" | "intermediate" | "advanced"
          explanation?: string | null
          id?: string
          question_text: string
          time_limit_seconds?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          difficulty?: "beginner" | "intermediate" | "advanced"
          explanation?: string | null
          id?: string
          question_text?: string
          time_limit_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_sessions: {
        Row: {
          admin_id: string | null
          created_at: string | null
          difficulty: "beginner" | "intermediate" | "advanced" | null
          id: string
          join_code: string | null
          status: "waiting" | "active" | "finished"
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          difficulty?: "beginner" | "intermediate" | "advanced" | null
          id?: string
          join_code?: string | null
          status?: "waiting" | "active" | "finished"
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          difficulty?: "beginner" | "intermediate" | "advanced" | null
          id?: string
          join_code?: string | null
          status?: "waiting" | "active" | "finished"
        }
        Relationships: []
      }
      responses: {
        Row: {
          created_at: string | null
          id: string
          is_correct: boolean | null
          option_id: string | null
          player_id: string | null
          question_id: string | null
          response_time_ms: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          option_id?: string | null
          player_id?: string | null
          question_id?: string | null
          response_time_ms?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          option_id?: string | null
          player_id?: string | null
          question_id?: string | null
          response_time_ms?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "responses_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
  }
}
