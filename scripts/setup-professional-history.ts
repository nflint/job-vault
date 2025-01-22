import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Note: We need the service role key to create tables
)

async function setupProfessionalHistory() {
  console.log('Setting up professional history tables...')

  try {
    // Enable extensions
    await supabase.rpc('extensions', {
      extensions: ['vector', 'uuid-ossp']
    })

    // Create tables
    const { error: historiesError } = await supabase.rpc('create_professional_histories_table')
    if (historiesError) throw historiesError

    const { error: experiencesError } = await supabase.rpc('create_work_experiences_table')
    if (experiencesError) throw experiencesError

    const { error: achievementsError } = await supabase.rpc('create_achievements_table')
    if (achievementsError) throw achievementsError

    const { error: metricsError } = await supabase.rpc('create_achievement_metrics_table')
    if (metricsError) throw metricsError

    const { error: educationError } = await supabase.rpc('create_education_table')
    if (educationError) throw educationError

    const { error: projectsError } = await supabase.rpc('create_projects_table')
    if (projectsError) throw projectsError

    const { error: projectMetricsError } = await supabase.rpc('create_project_metrics_table')
    if (projectMetricsError) throw projectMetricsError

    const { error: skillsError } = await supabase.rpc('create_skills_table')
    if (skillsError) throw skillsError

    const { error: skillContextsError } = await supabase.rpc('create_skill_contexts_table')
    if (skillContextsError) throw skillContextsError

    console.log('Successfully created all tables!')
  } catch (error) {
    console.error('Error setting up tables:', error)
    process.exit(1)
  }
}

setupProfessionalHistory() 