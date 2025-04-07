import { describe, expect, test } from '@jest/globals'
import { stripIndent, stripIndents } from 'common-tags'
import { processSql } from '../processor'
import { renderPowerbaseJs } from './powerbase-js'

describe('select', () => {
  test('specified columns', async () => {
    const sql = stripIndents`
      select
        title,
        description
      from
        books
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select(
          \`
          title,
          description
          \`,
        )
    `)
  })

  test('inline target expression fails', async () => {
    const sql = stripIndents`
      select
        1 + 1
      from
        books
    `

    await expect(processSql(sql)).rejects.toThrowError()
  })

  test('missing table fails', async () => {
    const sql = stripIndents`
      select 'Test'
    `

    await expect(processSql(sql)).rejects.toThrowError()
  })

  test('aliased column', async () => {
    const sql = stripIndents`
      select
        title as my_title
      from
        books
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select('my_title:title')
    `)
  })

  test('remove alias when it matches column name', async () => {
    const sql = stripIndents`
      select
        title as title
      from
        books
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select('title')
    `)
  })

  test('equal', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        title = 'Cheese'
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .eq('title', 'Cheese')
    `)
  })

  test('not equal', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        title != 'Cheese'
    `
    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .neq('title', 'Cheese')
    `)
  })

  test('not wrapped equal', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        not (
          title = 'Cheese'
        )
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .not('title', 'eq', 'Cheese')
    `)
  })

  test('null', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        title is null
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .is('title', null)
    `)
  })

  test('not null', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        title is not null
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .not('title', 'is', null)
    `)
  })

  test('greater than', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        pages > 10
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .gt('pages', 10)
    `)
  })

  test('greater than or equal', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        pages >= 10
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .gte('pages', 10)
    `)
  })

  test('less than', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        pages < 10
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .lt('pages', 10)
    `)
  })

  test('less than or equal', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        pages <= 10
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .lte('pages', 10)
    `)
  })

  test('like', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        description like 'Cheese%'
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .like('description', 'Cheese%')
    `)
  })

  test('ilike', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        description ilike '%cheese%'
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .ilike('description', '%cheese%')
    `)
  })

  test('match', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        description ~ '^[a-zA-Z]+'
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .match('description', '^[a-zA-Z]+')
    `)
  })

  test('imatch', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        description ~* '^[a-z]+'
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .imatch('description', '^[a-z]+')
    `)
  })

  test('in operator', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        category in ('fiction', 'sci-fi')
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .in('category', ['fiction', 'sci-fi'])
    `)
  })

  test('full text search using to_tsquery', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        description @@ to_tsquery('cheese')
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .textSearch('description', 'cheese')
    `)
  })

  test('full text search using plainto_tsquery', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        description @@ plainto_tsquery('cheese')
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .textSearch('description', 'cheese', {
          type: 'plain',
        })
    `)
  })

  test('full text search using phraseto_tsquery', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        description @@ phraseto_tsquery('cheese')
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .textSearch('description', 'cheese', {
          type: 'phrase',
        })
    `)
  })

  test('full text search using websearch_to_tsquery', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        description @@ websearch_to_tsquery('cheese')
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .textSearch('description', 'cheese', {
          type: 'websearch',
        })
    `)
  })

  test('full text search passing config to to_tsquery', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        description @@ to_tsquery('english', 'cheese')
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .textSearch('description', 'cheese', {
          config: 'english',
        })
    `)
  })

  test('full text search passing config to to_tsquery', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        description @@ to_tsquery('english', 'cheese')
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .textSearch('description', 'cheese', {
          config: 'english',
        })
    `)
  })

  test('negated full text search', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        not (description @@ to_tsquery('cheese'))
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .not('description', 'fts', 'cheese')
    `)
  })

  test('negated full text search with config', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        not (description @@ to_tsquery('english', 'cheese'))
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .not(
          'description',
          'fts(english)',
          'cheese',
        )
    `)
  })

  test('negated full text search using websearch_to_tsquery and config', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        not (description @@ websearch_to_tsquery('english', 'cheese'))
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .not(
          'description',
          'wfts(english)',
          'cheese',
        )
    `)
  })

  test('"and" expression', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        title = 'Cheese' and
        description ilike '%salsa%'
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .eq('title', 'Cheese')
        .ilike('description', '%salsa%')
    `)
  })

  test('"or" expression', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        title = 'Cheese' or
        title = 'Salsa'
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .or('title.eq.Cheese, title.eq.Salsa')
    `)
  })

  test('negated "and" expression', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        not (
          title = 'Cheese' and
          description ilike '%salsa%'
        )
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .or(
          'not.and(title.eq.Cheese, description.ilike.%salsa%)',
        )
    `)
  })

  test('negated "or" expression', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        not (
          title = 'Cheese' or
          title = 'Salsa'
        )
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .or(
          'not.or(title.eq.Cheese, title.eq.Salsa)',
        )
    `)
  })

  test('"and" expression with nested "or"', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        title like 'T%' and
        (
          description ilike '%tacos%' or
          description ilike '%salsa%'
        )
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .like('title', 'T%')
        .or(
          'description.ilike.%tacos%, description.ilike.%salsa%',
        )
    `)
  })

  test('negated "and" expression with nested "or"', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        not (
          title like 'T%' and
          (
            description ilike '%tacos%' or
            description ilike '%salsa%'
          )
        )
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .or(
          'not.and(title.like.T%, or(description.ilike.%tacos%, description.ilike.%salsa%))',
        )
    `)
  })

  test('negated "and" expression with negated nested "or"', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        not (
          title like 'T%' and
          not (
            description ilike '%tacos%' or
            description ilike '%salsa%'
          )
        )
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .or(
          'not.and(title.like.T%, not.or(description.ilike.%tacos%, description.ilike.%salsa%))',
        )
    `)
  })

  test('order of operations', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      where
        title like 'T%' and
        description ilike '%tacos%' or
        description ilike '%salsa%'
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .or(
          'and(title.like.T%, description.ilike.%tacos%), description.ilike.%salsa%',
        )
    `)
  })

  test('limit', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      limit
        5
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .limit(5)
    `)
  })

  test('offset without limit fails', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      offset
        10
    `

    const statement = await processSql(sql)

    await expect(renderPowerbaseJs(statement)).rejects.toThrowError()
  })

  test('limit and offset', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      limit
        5
      offset
        10
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .range(10, 15)
    `)
  })

  test('order by', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      order by
        title
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .order('title')
    `)
  })

  test('order by multiple columns', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      order by
        title,
        description
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .order('title')
        .order('description')
    `)
  })

  test('order by asc', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      order by
        title asc
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .order('title', { ascending: true })
    `)
  })

  test('order by desc', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      order by
        title desc
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .order('title', { ascending: false })
    `)
  })

  test('order by nulls first', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      order by
        title nulls first
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .order('title', { nullsFirst: true })
    `)
  })

  test('order by nulls last', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      order by
        title nulls last
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .order('title', { nullsFirst: false })
    `)
  })

  test('order by desc nulls last', async () => {
    const sql = stripIndents`
      select
        *
      from
        books
      order by
        title desc nulls last
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select()
        .order('title', {
          ascending: false,
          nullsFirst: false,
        })
    `)
  })

  test('cast', async () => {
    const sql = stripIndents`
      select
        pages::float
      from
        books
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select('pages::float')
    `)
  })

  test('cast with alias', async () => {
    const sql = stripIndents`
      select
        pages::float as "partialPages"
      from
        books
    `

    const statement = await processSql(sql)
    const { code } = await renderPowerbaseJs(statement)

    expect(code).toBe(stripIndent`
      const { data, error } = await powerbase
        .from('books')
        .select('partialPages:pages::float')
    `)
  })

  test('cast in where clause fails', async () => {
    const sql = stripIndents`
      select
        pages
      from
        books
      where
        pages::float > 10.0
    `

    await expect(processSql(sql)).rejects.toThrowError()
  })

  test('cast in order by clause fails', async () => {
    const sql = stripIndents`
      select
        pages
      from
        books
      order by
        pages::float desc
    `

    await expect(processSql(sql)).rejects.toThrowError()
  })
})
