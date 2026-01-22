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
      products: {
        Row: {
          id: string
          created_at: string
          name: string
          features: Json // Storing features as JSON for flexibility
          description: string | null
          website_url: string | null
          pricing_info: Json | null
        }
        Insert: {
          id: string
          created_at?: string
          name: string
          features?: Json
          description?: string | null
          website_url?: string | null
          pricing_info?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          features?: Json
          description?: string | null
          website_url?: string | null
          pricing_info?: Json | null
        }
      }
      tracking_events: {
        Row: {
          id: string
          created_at: string
          session_id: string
          event_type: 'page_view' | 'quiz_start' | 'quiz_complete' | 'outbound_click' | 'comparison_view'
          payload: Json | null
          path: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          session_id: string
          event_type: 'page_view' | 'quiz_start' | 'quiz_complete' | 'outbound_click' | 'comparison_view'
          payload?: Json | null
          path?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          session_id?: string
          event_type?: 'page_view' | 'quiz_start' | 'quiz_complete' | 'outbound_click' | 'comparison_view'
          payload?: Json | null
          path?: string | null
        }
      }
      leads: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string | null
          company: string | null
          source: string | null
          status: 'new' | 'contacted' | 'converted'
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          name?: string | null
          company?: string | null
          source?: string | null
          status?: 'new' | 'contacted' | 'converted'
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string | null
          company?: string | null
          source?: string | null
          status?: 'new' | 'contacted' | 'converted'
        }
      }
      quiz_submissions: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          session_id: string
          answers: Json
          result_product: string | null
          language: string | null
          location: string | null
          lawyer_count: number | null
          refa_count: number | null
          current_software: string | null
          current_software_other: string | null
          work_focus: string | null
          billing_type: string | null
          notary: boolean | null
          notary_count: number | null
          average_hourly_rate: number | null
          maturity_q1: boolean | null
          maturity_q3: boolean | null
          maturity_q4: boolean | null
          maturity_q5: boolean | null
          maturity_q6: boolean | null
          maturity_q7: boolean | null
          maturity_q8: boolean | null
          maturity_q9: boolean | null
          maturity_q10: boolean | null
          maturity_q11: boolean | null
          maturity_q12: boolean | null
          maturity_q13: boolean | null
          maturity_q14: boolean | null
          maturity_q15: boolean | null
          maturity_q16: boolean | null
        }
        Insert: {
          id?: string
          created_at?: string
          session_id: string
          answers: Json
          result_product?: string | null
          language?: string | null
          location?: string | null
          lawyer_count?: number | null
          refa_count?: number | null
          current_software?: string | null
          current_software_other?: string | null
          work_focus?: string | null
          billing_type?: string | null
          notary?: boolean | null
          notary_count?: number | null
          average_hourly_rate?: number | null
          maturity_q1: boolean | null
          maturity_q3: boolean | null
          maturity_q4: boolean | null
          maturity_q5: boolean | null
          maturity_q6: boolean | null
          maturity_q7: boolean | null
          maturity_q8: boolean | null
          maturity_q9: boolean | null
          maturity_q10: boolean | null
          maturity_q11: boolean | null
          maturity_q12: boolean | null
          maturity_q13: boolean | null
          maturity_q14: boolean | null
          maturity_q15: boolean | null
          maturity_q16: boolean | null
        }
        Update: {
          id?: string
          created_at?: string
          session_id?: string
          answers?: Json
          result_product?: string | null
          language?: string | null
          location?: string | null
          lawyer_count?: number | null
          refa_count?: number | null
          current_software?: string | null
          current_software_other?: string | null
          work_focus?: string | null
          billing_type?: string | null
          notary?: boolean | null
          notary_count?: number | null
          average_hourly_rate?: number | null
          maturity_q1: boolean | null
          maturity_q3: boolean | null
          maturity_q4: boolean | null
          maturity_q5: boolean | null
          maturity_q6: boolean | null
          maturity_q7: boolean | null
          maturity_q8: boolean | null
          maturity_q9: boolean | null
          maturity_q10: boolean | null
          maturity_q11: boolean | null
          maturity_q12: boolean | null
          maturity_q13: boolean | null
          maturity_q14: boolean | null
          maturity_q15: boolean | null
          maturity_q16: boolean | null
        }
      }
    }
  }
}
