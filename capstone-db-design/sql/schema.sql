create table users (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text unique not null,
    created_at timestamp default now()
);

create table boards (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    user_id uuid references users(id) on delete cascade,
    created_at timestamp default now()
);

create table lists (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    board_id uuid references boards(id) on delete cascade,
    position integer,
    created_at timestamp default now()
);

create table tasks (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    status text default 'Todo',
    due_date date,
    list_id uuid references lists(id) on delete cascade,
    created_at timestamp default now()
);

