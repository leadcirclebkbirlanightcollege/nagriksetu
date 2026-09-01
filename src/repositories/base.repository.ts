// Base repository: shared Supabase access + error normalisation.
import type { PostgrestError } from "@supabase/supabase-js"
import { requireSupabase, supabase } from "../lib/supabase"

export class RepositoryError extends Error {
  cause?: PostgrestError
  constructor(message: string, cause?: PostgrestError) {
    super(message)
    this.name = "RepositoryError"
    this.cause = cause
  }
}

/** Throws a normalised error when a Supabase call fails. */
export function unwrap<T>(result: { data: T; error: PostgrestError | null }): T {
  if (result.error) {
    throw new RepositoryError(result.error.message, result.error)
  }
  return result.data
}

export abstract class BaseRepository {
  protected get db() {
    return requireSupabase()
  }
  /** True when the backend is available; repositories fall back to mocks otherwise. */
  get enabled(): boolean {
    return supabase !== null
  }
}
