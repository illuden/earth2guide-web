-- 002_wiki_category_v2.sql
-- WikiCategory 5개 → 7개 (earth2.io/how-to 카테고리 1:1 매핑)
--
-- before: account, essence, jewel, raid, general
-- after:  overview, account, land, sub-asset, ecosims, create, market
--
-- wiki_pages 0건 상태에서 실행 (안전).
-- 만약 데이터 있다면: 기존 essence→ecosims, jewel→sub-asset, general→overview 매핑 별도 처리 필요.

begin;

-- 1) 기존 CHECK constraint 제거
alter table wiki_pages
  drop constraint if exists wiki_pages_category_check;

-- 2) 새 CHECK constraint 추가
alter table wiki_pages
  add constraint wiki_pages_category_check
  check (category in ('overview','account','land','sub-asset','ecosims','create','market'));

commit;
