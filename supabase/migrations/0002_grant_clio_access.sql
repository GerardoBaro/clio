grant usage on schema clio to authenticated, anon;

grant select on all tables in schema clio to authenticated, anon;
grant all on all tables in schema clio to service_role;

alter default privileges in schema clio grant select on tables to authenticated, anon;
alter default privileges in schema clio grant all on tables to service_role;
