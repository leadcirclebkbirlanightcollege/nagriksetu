import { useAsync } from "./useAsync"
import { referenceRepository } from "../repositories/reference.repository"
import { hasSupabase } from "../lib/supabase"
import type { Area, Department, Officer, Ward } from "../types"

const EMPTY = { wards: [] as Ward[], areas: [] as Area[], departments: [] as Department[], officers: [] as Officer[] }

export function useGeo() {
  return useAsync(async () => {
    if (!hasSupabase) return EMPTY
    const [wards, areas, departments, officers] = await Promise.all([
      referenceRepository.wards().catch(() => []),
      referenceRepository.areas().catch(() => []),
      referenceRepository.departments().catch(() => []),
      referenceRepository.officers().catch(() => []),
    ])
    return { wards, areas, departments, officers }
  }, [])
}
