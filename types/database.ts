export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      past_papers: {
        Row: {
          id: string;
          teacher_name: string;
          type: "mid term" | "final term";
          department: string;
          semester: string;
          course: string;
          year: number;
          file_url: string;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          teacher_name: string;
          type: "mid term" | "final term";
          department: string;
          semester: string;
          course: string;
          year: number;
          file_url: string;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          teacher_name?: string;
          type?: "mid term" | "final term";
          department?: string;
          semester?: string;
          course?: string;
          year?: number;
          file_url?: string;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      achievements: {
        Row: {
          id: string;
          student_name: string;
          department: string;
          achievement_title: string;
          description: string;
          github_link: string | null;
          linkedin_link: string | null;
          photo_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_name: string;
          department: string;
          achievement_title: string;
          description: string;
          github_link?: string | null;
          linkedin_link?: string | null;
          photo_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_name?: string;
          department?: string;
          achievement_title?: string;
          description?: string;
          github_link?: string | null;
          linkedin_link?: string | null;
          photo_url?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          role: "admin" | "student" | "super_admin";
          admin_for_department: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          role?: "admin" | "student" | "super_admin";
          admin_for_department?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: "admin" | "student" | "super_admin";
          admin_for_department?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_admin_users: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          role: string;
          created_at: string;
          admin_for_department: string | null;
          email: string | null;
          display_name: string | null;
        }[];
      };
      is_current_user_super_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_current_user_uploader: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type PastPaper = Database["public"]["Tables"]["past_papers"]["Row"];
export type Achievement = Database["public"]["Tables"]["achievements"]["Row"];
