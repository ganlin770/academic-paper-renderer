-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type user_role as enum ('viewer', 'editor', 'admin');
create type paper_status as enum ('draft', 'published', 'archived');
create type notification_type as enum ('paper_shared', 'comment_added', 'version_created', 'collaboration_invite');

-- Users table (extends auth.users)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  display_name text not null,
  avatar_url text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- User settings table
create table public.user_settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  theme text default 'system' check (theme in ('light', 'dark', 'system')),
  editor_font_size integer default 14 check (editor_font_size between 10 and 24),
  editor_font_family text default 'JetBrains Mono',
  preview_font_size integer default 16 check (preview_font_size between 12 and 24),
  auto_save_interval integer default 30 check (auto_save_interval between 5 and 300),
  show_line_numbers boolean default true,
  word_wrap boolean default true,
  minimap_enabled boolean default true,
  vim_mode_enabled boolean default false,
  notifications_enabled boolean default true,
  email_notifications boolean default true,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  unique(user_id)
);

-- Papers table
create table public.papers (
  id uuid primary key default uuid_generate_v4(),
  title text not null check (length(title) > 0),
  content text default '',
  author_id uuid references public.users(id) on delete cascade not null,
  status paper_status default 'draft',
  is_public boolean default false,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Paper versions table
create table public.paper_versions (
  id uuid primary key default uuid_generate_v4(),
  paper_id uuid references public.papers(id) on delete cascade not null,
  content text not null,
  version_name text not null,
  commit_message text,
  created_at timestamp with time zone default now() not null,
  created_by uuid references public.users(id) on delete cascade not null
);

-- Paper collaborators table
create table public.paper_collaborators (
  id uuid primary key default uuid_generate_v4(),
  paper_id uuid references public.papers(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  role user_role default 'viewer',
  invited_at timestamp with time zone default now() not null,
  accepted_at timestamp with time zone,
  unique(paper_id, user_id)
);

-- Paper comments table
create table public.paper_comments (
  id uuid primary key default uuid_generate_v4(),
  paper_id uuid references public.papers(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  content text not null check (length(content) > 0),
  line_number integer,
  resolved boolean default false,
  parent_id uuid references public.paper_comments(id) on delete cascade,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Paper templates table
create table public.paper_templates (
  id uuid primary key default uuid_generate_v4(),
  name text not null check (length(name) > 0),
  description text,
  content text not null,
  category text default 'general',
  author_id uuid references public.users(id) on delete cascade not null,
  is_public boolean default false,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Uploaded files table
create table public.uploaded_files (
  id uuid primary key default uuid_generate_v4(),
  paper_id uuid references public.papers(id) on delete cascade not null,
  filename text not null,
  file_path text not null,
  file_size bigint not null check (file_size > 0),
  mime_type text not null,
  uploaded_by uuid references public.users(id) on delete cascade not null,
  uploaded_at timestamp with time zone default now() not null
);

-- Notifications table
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  type notification_type not null,
  title text not null,
  message text not null,
  paper_id uuid references public.papers(id) on delete cascade,
  comment_id uuid references public.paper_comments(id) on delete cascade,
  read boolean default false,
  created_at timestamp with time zone default now() not null
);

-- Create indexes for better performance
create index papers_author_id_idx on public.papers(author_id);
create index papers_status_idx on public.papers(status);
create index papers_created_at_idx on public.papers(created_at desc);
create index papers_updated_at_idx on public.papers(updated_at desc);

create index paper_versions_paper_id_idx on public.paper_versions(paper_id);
create index paper_versions_created_at_idx on public.paper_versions(created_at desc);

create index paper_collaborators_paper_id_idx on public.paper_collaborators(paper_id);
create index paper_collaborators_user_id_idx on public.paper_collaborators(user_id);

create index paper_comments_paper_id_idx on public.paper_comments(paper_id);
create index paper_comments_user_id_idx on public.paper_comments(user_id);
create index paper_comments_parent_id_idx on public.paper_comments(parent_id);

create index notifications_user_id_idx on public.notifications(user_id);
create index notifications_read_idx on public.notifications(read);
create index notifications_created_at_idx on public.notifications(created_at desc);

create index uploaded_files_paper_id_idx on public.uploaded_files(paper_id);

-- Create functions for updating timestamps
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updating timestamps
create trigger update_users_updated_at before update on public.users
  for each row execute function public.update_updated_at_column();

create trigger update_user_settings_updated_at before update on public.user_settings
  for each row execute function public.update_updated_at_column();

create trigger update_papers_updated_at before update on public.papers
  for each row execute function public.update_updated_at_column();

create trigger update_paper_comments_updated_at before update on public.paper_comments
  for each row execute function public.update_updated_at_column();

create trigger update_paper_templates_updated_at before update on public.paper_templates
  for each row execute function public.update_updated_at_column();

-- Create function to automatically create user profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  
  insert into public.user_settings (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user registration
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Create function to automatically create paper version
create or replace function public.create_paper_version()
returns trigger as $$
begin
  -- Only create version if content has changed
  if (old.content is null or old.content != new.content) then
    insert into public.paper_versions (paper_id, content, version_name, commit_message, created_by)
    values (
      new.id, 
      new.content, 
      'v' || (select count(*) + 1 from public.paper_versions where paper_id = new.id),
      case 
        when old.content is null then 'Initial version'
        else 'Auto-saved version'
      end,
      new.author_id
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for automatic versioning
create trigger create_paper_version_trigger
  after insert or update of content on public.papers
  for each row execute function public.create_paper_version();