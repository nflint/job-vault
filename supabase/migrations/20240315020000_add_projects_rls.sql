-- Enable RLS on projects table if not already enabled
alter table public.projects enable row level security;

-- Add RLS policies for projects table
create policy "Users can view their projects"
on public.projects for select
to authenticated
using (history_id in (
    select id from public.professional_histories
    where user_id = auth.uid()
));

create policy "Users can insert their projects"
on public.projects for insert
to authenticated
with check (history_id in (
    select id from public.professional_histories
    where user_id = auth.uid()
));

create policy "Users can update their projects"
on public.projects for update
to authenticated
using (history_id in (
    select id from public.professional_histories
    where user_id = auth.uid()
));

create policy "Users can delete their projects"
on public.projects for delete
to authenticated
using (history_id in (
    select id from public.professional_histories
    where user_id = auth.uid()
)); 