-- Disposable database only.
\set ON_ERROR_STOP on
CREATE ROLE anon; CREATE ROLE authenticated;
CREATE SCHEMA auth;
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
CREATE TABLE profiles(id uuid PRIMARY KEY, role text);
INSERT INTO profiles VALUES ('00000000-0000-0000-0000-000000000001','admin'),('00000000-0000-0000-0000-000000000002','user');
CREATE FUNCTION can_manage_note_folders() RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path='' AS $$ SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND role='admin') $$;
CREATE TABLE concepts(id uuid PRIMARY KEY,name text,slug text UNIQUE,short_definition text,explanation text);
CREATE TABLE concept_subtopics(concept_id uuid REFERENCES concepts(id),subtopic_id uuid);
CREATE TABLE notes(id uuid PRIMARY KEY,content text,content_json jsonb);
CREATE TABLE other_resource(concept_id uuid REFERENCES concepts(id) ON DELETE CASCADE);
ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_subtopics ENABLE ROW LEVEL SECURITY;
CREATE POLICY legacy_all ON concepts FOR ALL USING(true) WITH CHECK(true);
CREATE POLICY legacy_all ON concept_subtopics FOR ALL USING(true) WITH CHECK(true);
GRANT USAGE ON SCHEMA public,auth TO anon,authenticated;
GRANT ALL ON concepts,concept_subtopics TO anon,authenticated;
\ir ../database/migrations/20261020_concept_review_actions.sql
INSERT INTO concepts VALUES ('00000000-0000-0000-0000-000000000010','Old','old','Definition','Explanation');
INSERT INTO concept_subtopics VALUES ('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020');
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
DO $$ DECLARE n integer; BEGIN
 UPDATE concepts SET name='Forbidden'; GET DIAGNOSTICS n=ROW_COUNT; IF n<>0 THEN RAISE EXCEPTION 'Reader wrote'; END IF;
 DELETE FROM concepts; GET DIAGNOSTICS n=ROW_COUNT; IF n<>0 THEN RAISE EXCEPTION 'Reader deleted'; END IF;
 DELETE FROM concept_subtopics; GET DIAGNOSTICS n=ROW_COUNT; IF n<>0 THEN RAISE EXCEPTION 'Reader removed links'; END IF;
 BEGIN
  PERFORM review_concept_action('00000000-0000-0000-0000-000000000010','{}','delete');
  RAISE EXCEPTION 'Reader RPC allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
SELECT review_concept_action('00000000-0000-0000-0000-000000000010','{"name":"Old","shortDefinition":"Definition","explanation":"Explanation"}','edit','{"name":"New","shortDefinition":"Ny definisjon","explanation":"Ny forklaring"}');
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM concepts WHERE name='New' AND slug='old') OR (SELECT count(*) FROM concept_subtopics)<>1 THEN RAISE EXCEPTION 'Edit changed identity/links'; END IF;
 BEGIN
  PERFORM review_concept_action('00000000-0000-0000-0000-000000000010','{}','delete');
  RAISE EXCEPTION 'Stale delete allowed';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM='Stale delete allowed' THEN RAISE; END IF; END;
END $$;
DO $$ BEGIN
 BEGIN
  PERFORM review_concept_action('00000000-0000-0000-0000-000000000010','{"name":"New","shortDefinition":"Ny definisjon","explanation":"Ny forklaring"}','edit','{"name":" ","shortDefinition":"x","explanation":""}');
  RAISE EXCEPTION 'Invalid edit allowed';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM='Invalid edit allowed' THEN RAISE; END IF; END;
 IF (SELECT name FROM concepts LIMIT 1)<>'New' THEN RAISE EXCEPTION 'Invalid edit changed data'; END IF;
END $$;
INSERT INTO concepts VALUES ('00000000-0000-0000-0000-000000000011','Other','other','Other','Other');
DO $$ BEGIN
 BEGIN
  PERFORM review_concept_action('00000000-0000-0000-0000-000000000010','{"name":"New","shortDefinition":"Ny definisjon","explanation":"Ny forklaring"}','edit','{"name":"Other","shortDefinition":"x","explanation":""}');
  RAISE EXCEPTION 'Duplicate name allowed';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM='Duplicate name allowed' THEN RAISE; END IF; END;
END $$;
DELETE FROM concepts WHERE name='Other';
RESET ROLE;
INSERT INTO notes VALUES ('00000000-0000-0000-0000-000000000030','<a href="/concepts/old">Name</a>','{"conceptId":"00000000-0000-0000-0000-000000000010"}');
SET ROLE authenticated;
DO $$ BEGIN
 BEGIN
  DELETE FROM concepts;
  RAISE EXCEPTION 'Referenced delete allowed';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM='Referenced delete allowed' THEN RAISE; END IF; END;
 IF (SELECT count(*) FROM concept_subtopics)<>1 THEN RAISE EXCEPTION 'Blocked delete removed links'; END IF;
END $$;
RESET ROLE;
DELETE FROM notes;
INSERT INTO other_resource VALUES ('00000000-0000-0000-0000-000000000010');
SET ROLE authenticated;
DO $$ BEGIN
 BEGIN DELETE FROM concepts; RAISE EXCEPTION 'Cascade allowed';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM='Cascade allowed' THEN RAISE; END IF; END;
END $$;
RESET ROLE;
DELETE FROM other_resource;
SET ROLE authenticated;
SELECT review_concept_action('00000000-0000-0000-0000-000000000010','{"name":"New","shortDefinition":"Ny definisjon","explanation":"Ny forklaring"}','delete');
DO $$ BEGIN IF EXISTS(SELECT 1 FROM concepts) OR EXISTS(SELECT 1 FROM concept_subtopics) THEN RAISE EXCEPTION 'Cleanup incomplete'; END IF; END $$;
RESET ROLE;
SET ROLE anon;
DO $$ BEGIN
 BEGIN PERFORM review_concept_action('x','{}','delete'); RAISE EXCEPTION 'Anon allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
