/**
 * Typed schema for the AIme Supabase DB.
 *
 * Hand-authored from supabase/migrations/0001_aime_core.sql (the canonical
 * `supabase gen types typescript` run needs the live project, which is gated on
 * the aime-golf restore). Regenerate from the live DB once it is up and this
 * file can be replaced wholesale. Used to type the client in supabase.ts.
 */

export type ShotCondition =
  | 'Tee'
  | 'Fairway'
  | 'Rough'
  | 'Bunker'
  | 'Penalty'
  | 'Green';

export type ShotResult =
  | 'Good'
  | 'Fair'
  | 'Poor'
  | 'Out of Bounds'
  | 'Water'
  | 'Hazard';

export type ClubTypeEnum =
  | 'Driver'
  | 'Fairway Wood'
  | 'Hybrid'
  | 'Iron'
  | 'Wedge'
  | 'Putter';

export type RoundFormatEnum =
  | 'Stroke Play'
  | 'Match Play'
  | 'Scramble'
  | 'Best Ball';

export type RoundStatus = 'in_progress' | 'complete' | 'abandoned';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          handicap: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          handicap?: number | null;
        };
        Update: {
          display_name?: string | null;
          handicap?: number | null;
        };
        Relationships: [];
      };
      clubs: {
        Row: {
          id: string;
          profile_id: string;
          name: string;
          type: ClubTypeEnum;
          average_distance: number;
          min_distance: number | null;
          max_distance: number | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          name: string;
          type: ClubTypeEnum;
          average_distance: number;
          min_distance?: number | null;
          max_distance?: number | null;
          sort_order?: number;
        };
        Update: {
          name?: string;
          type?: ClubTypeEnum;
          average_distance?: number;
          min_distance?: number | null;
          max_distance?: number | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          external_ref: string | null;
          name: string;
          location: string | null;
          total_par: number | null;
          total_yards: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          external_ref?: string | null;
          name: string;
          location?: string | null;
          total_par?: number | null;
          total_yards?: number | null;
        };
        Update: {
          external_ref?: string | null;
          name?: string;
          location?: string | null;
          total_par?: number | null;
          total_yards?: number | null;
        };
        Relationships: [];
      };
      holes_info: {
        Row: {
          id: string;
          course_id: string;
          number: number;
          par: number;
          yards: number | null;
          handicap: number | null;
        };
        Insert: {
          id?: string;
          course_id: string;
          number: number;
          par: number;
          yards?: number | null;
          handicap?: number | null;
        };
        Update: {
          par?: number;
          yards?: number | null;
          handicap?: number | null;
        };
        Relationships: [];
      };
      rounds: {
        Row: {
          id: string;
          profile_id: string;
          course_id: string | null;
          format: RoundFormatEnum;
          gps_enabled: boolean;
          puck_enabled: boolean;
          auto_track_shots: boolean;
          start_time: string;
          end_time: string | null;
          current_hole: number;
          status: RoundStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          course_id?: string | null;
          format?: RoundFormatEnum;
          gps_enabled?: boolean;
          puck_enabled?: boolean;
          auto_track_shots?: boolean;
          start_time?: string;
          end_time?: string | null;
          current_hole?: number;
          status?: RoundStatus;
        };
        Update: {
          course_id?: string | null;
          format?: RoundFormatEnum;
          end_time?: string | null;
          current_hole?: number;
          status?: RoundStatus;
        };
        Relationships: [];
      };
      round_holes: {
        Row: {
          id: string;
          round_id: string;
          number: number;
          par: number;
          score: number | null;
          fairway_hit: boolean | null;
          green_in_regulation: boolean | null;
          putts: number;
          penalties: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          round_id: string;
          number: number;
          par: number;
          score?: number | null;
          fairway_hit?: boolean | null;
          green_in_regulation?: boolean | null;
          putts?: number;
          penalties?: number;
        };
        Update: {
          par?: number;
          score?: number | null;
          fairway_hit?: boolean | null;
          green_in_regulation?: boolean | null;
          putts?: number;
          penalties?: number;
        };
        Relationships: [];
      };
      shots: {
        Row: {
          id: string;
          round_id: string;
          round_hole_id: string | null;
          hole_number: number;
          shot_number: number;
          club: string | null;
          distance: number | null;
          condition: ShotCondition | null;
          result: ShotResult | null;
          gps_lat: number | null;
          gps_lon: number | null;
          carry: number | null;
          total: number | null;
          remaining: number | null;
          taken_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          round_id: string;
          round_hole_id?: string | null;
          hole_number: number;
          shot_number: number;
          club?: string | null;
          distance?: number | null;
          condition?: ShotCondition | null;
          result?: ShotResult | null;
          gps_lat?: number | null;
          gps_lon?: number | null;
          carry?: number | null;
          total?: number | null;
          remaining?: number | null;
          taken_at?: string;
        };
        Update: {
          club?: string | null;
          distance?: number | null;
          condition?: ShotCondition | null;
          result?: ShotResult | null;
        };
        Relationships: [];
      };
      putt_reads: {
        Row: {
          id: string;
          round_id: string | null;
          round_hole_id: string | null;
          ball_lat: number;
          ball_lon: number;
          cup_lat: number;
          cup_lon: number;
          stimp: number;
          aim_line_deg: number | null;
          initial_speed_mph: number | null;
          instruction_text: string | null;
          plot_points: { x: number; y: number }[] | null;
          solver_request_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          round_id?: string | null;
          round_hole_id?: string | null;
          ball_lat: number;
          ball_lon: number;
          cup_lat: number;
          cup_lon: number;
          stimp: number;
          aim_line_deg?: number | null;
          initial_speed_mph?: number | null;
          instruction_text?: string | null;
          plot_points?: { x: number; y: number }[] | null;
          solver_request_id?: string | null;
        };
        Update: {
          instruction_text?: string | null;
        };
        Relationships: [];
      };
      round_players: {
        Row: {
          id: string;
          round_id: string;
          profile_id: string | null;
          guest_name: string | null;
          scores: number[];
          created_at: string;
        };
        Insert: {
          id?: string;
          round_id: string;
          profile_id?: string | null;
          guest_name?: string | null;
          scores?: number[];
        };
        Update: {
          guest_name?: string | null;
          scores?: number[];
        };
        Relationships: [];
      };
    };
    Views: {
      round_statistics: {
        Row: {
          round_id: string | null;
          profile_id: string | null;
          total_score: number;
          total_par: number;
          score_to_par: number;
          front_nine_score: number;
          back_nine_score: number;
          fairways_hit: number;
          fairways_total: number;
          greens_in_regulation: number;
          greens_total: number;
          total_putts: number;
          total_penalties: number;
          birdies: number;
          pars: number;
          bogeys: number;
          double_bogeys_plus: number;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: {
      shot_condition: ShotCondition;
      shot_result: ShotResult;
      club_type: ClubTypeEnum;
      round_format: RoundFormatEnum;
      round_status: RoundStatus;
    };
  };
}
