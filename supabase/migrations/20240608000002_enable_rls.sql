-- Enable Row Level Security on all tables
alter table public.users enable row level security;
alter table public.user_settings enable row level security;
alter table public.papers enable row level security;
alter table public.paper_versions enable row level security;
alter table public.paper_collaborators enable row level security;
alter table public.paper_comments enable row level security;
alter table public.paper_templates enable row level security;
alter table public.uploaded_files enable row level security;
alter table public.notifications enable row level security;

-- Users policies
create policy "Users can view their own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = id);

-- User settings policies
create policy "Users can view their own settings" on public.user_settings
  for select using (auth.uid() = user_id);

create policy "Users can update their own settings" on public.user_settings
  for update using (auth.uid() = user_id);

-- Papers policies
create policy "Authors can manage their papers" on public.papers
  for all using (auth.uid() = author_id);

create policy "Public papers are viewable by all authenticated users" on public.papers
  for select using (
    auth.role() = 'authenticated' and 
    (is_public = true or auth.uid() = author_id)
  );

create policy "Collaborators can view papers they have access to" on public.papers
  for select using (
    auth.role() = 'authenticated' and 
    (
      auth.uid() = author_id or
      is_public = true or
      exists (
        select 1 from public.paper_collaborators
        where paper_id = papers.id 
        and user_id = auth.uid()
        and accepted_at is not null
      )
    )
  );

create policy "Collaborators with editor role can update papers" on public.papers
  for update using (
    auth.uid() = author_id or
    exists (
      select 1 from public.paper_collaborators
      where paper_id = papers.id 
      and user_id = auth.uid()
      and role in ('editor', 'admin')
      and accepted_at is not null
    )
  );

-- Paper versions policies
create policy "Users can view versions of accessible papers" on public.paper_versions
  for select using (
    exists (
      select 1 from public.papers
      where papers.id = paper_versions.paper_id
      and (
        auth.uid() = papers.author_id or
        papers.is_public = true or
        exists (
          select 1 from public.paper_collaborators
          where paper_collaborators.paper_id = papers.id
          and user_collaborators.user_id = auth.uid()
          and accepted_at is not null
        )
      )
    )
  );

create policy "Users can create versions for accessible papers" on public.paper_versions
  for insert with check (
    exists (
      select 1 from public.papers
      where papers.id = paper_versions.paper_id
      and (
        auth.uid() = papers.author_id or
        exists (
          select 1 from public.paper_collaborators
          where paper_collaborators.paper_id = papers.id
          and paper_collaborators.user_id = auth.uid()
          and role in ('editor', 'admin')
          and accepted_at is not null
        )
      )
    )
  );

-- Paper collaborators policies
create policy "Authors can manage collaborators" on public.paper_collaborators
  for all using (
    exists (
      select 1 from public.papers
      where papers.id = paper_collaborators.paper_id
      and papers.author_id = auth.uid()
    )
  );

create policy "Users can view collaborations they're part of" on public.paper_collaborators
  for select using (
    auth.uid() = user_id or
    exists (
      select 1 from public.papers
      where papers.id = paper_collaborators.paper_id
      and papers.author_id = auth.uid()
    )
  );

create policy "Users can update their own collaboration status" on public.paper_collaborators
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Paper comments policies
create policy "Users can view comments on accessible papers" on public.paper_comments
  for select using (
    exists (
      select 1 from public.papers
      where papers.id = paper_comments.paper_id
      and (
        auth.uid() = papers.author_id or
        papers.is_public = true or
        exists (
          select 1 from public.paper_collaborators
          where paper_collaborators.paper_id = papers.id
          and paper_collaborators.user_id = auth.uid()
          and accepted_at is not null
        )
      )
    )
  );

create policy "Users can create comments on accessible papers" on public.paper_comments
  for insert with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.papers
      where papers.id = paper_comments.paper_id
      and (
        auth.uid() = papers.author_id or
        papers.is_public = true or
        exists (
          select 1 from public.paper_collaborators
          where paper_collaborators.paper_id = papers.id
          and paper_collaborators.user_id = auth.uid()
          and accepted_at is not null
        )
      )
    )
  );

create policy "Users can update their own comments" on public.paper_comments
  for update using (auth.uid() = user_id);

create policy "Users can delete their own comments" on public.paper_comments
  for delete using (auth.uid() = user_id);

-- Paper templates policies
create policy "Users can manage their own templates" on public.paper_templates
  for all using (auth.uid() = author_id);

create policy "Public templates are viewable by all authenticated users" on public.paper_templates
  for select using (
    auth.role() = 'authenticated' and 
    (is_public = true or auth.uid() = author_id)
  );

-- Uploaded files policies
create policy "Users can view files in accessible papers" on public.uploaded_files
  for select using (
    exists (
      select 1 from public.papers
      where papers.id = uploaded_files.paper_id
      and (
        auth.uid() = papers.author_id or
        papers.is_public = true or
        exists (
          select 1 from public.paper_collaborators
          where paper_collaborators.paper_id = papers.id
          and paper_collaborators.user_id = auth.uid()
          and accepted_at is not null
        )
      )
    )
  );

create policy "Users can upload files to accessible papers" on public.uploaded_files
  for insert with check (
    auth.uid() = uploaded_by and
    exists (
      select 1 from public.papers
      where papers.id = uploaded_files.paper_id
      and (
        auth.uid() = papers.author_id or
        exists (
          select 1 from public.paper_collaborators
          where paper_collaborators.paper_id = papers.id
          and paper_collaborators.user_id = auth.uid()
          and role in ('editor', 'admin')
          and accepted_at is not null
        )
      )
    )
  );

create policy "Users can delete their own uploaded files" on public.uploaded_files
  for delete using (auth.uid() = uploaded_by);

-- Notifications policies
create policy "Users can view their own notifications" on public.notifications
  for select using (auth.uid() = user_id);

create policy "Users can update their own notifications" on public.notifications
  for update using (auth.uid() = user_id);

create policy "Users can delete their own notifications" on public.notifications
  for delete using (auth.uid() = user_id);

create policy "System can create notifications for users" on public.notifications
  for insert with check (true);