-- Drop RLS policies first
drop policy if exists "Users can view their own resumes" on public.resumes;
drop policy if exists "Users can create their own resumes" on public.resumes;
drop policy if exists "Users can update their own resumes" on public.resumes;
drop policy if exists "Users can delete their own resumes" on public.resumes;

drop policy if exists "Users can view their resume sections" on public.resume_sections;
drop policy if exists "Users can create their resume sections" on public.resume_sections;
drop policy if exists "Users can update their resume sections" on public.resume_sections;
drop policy if exists "Users can delete their resume sections" on public.resume_sections;

drop policy if exists "Users can view their resume items" on public.resume_items;
drop policy if exists "Users can create their resume items" on public.resume_items;
drop policy if exists "Users can update their resume items" on public.resume_items;
drop policy if exists "Users can delete their resume items" on public.resume_items;

drop policy if exists "Users can view their resume exports" on public.resume_exports;
drop policy if exists "Users can create their resume exports" on public.resume_exports;
drop policy if exists "Users can delete their resume exports" on public.resume_exports;

-- Drop triggers
drop trigger if exists update_resumes_timestamp on public.resumes;
drop trigger if exists update_resume_sections_timestamp on public.resume_sections;
drop trigger if exists update_resume_items_timestamp on public.resume_items;

-- Drop indexes
drop index if exists public.idx_resumes_user_id;
drop index if exists public.idx_resumes_history_id;
drop index if exists public.idx_resume_sections_resume_id;
drop index if exists public.idx_resume_items_section_id;
drop index if exists public.idx_resume_exports_resume_id;

-- Drop tables in reverse order of dependencies
drop table if exists public.resume_exports;
drop table if exists public.resume_items;
drop table if exists public.resume_sections;
drop table if exists public.resumes; 