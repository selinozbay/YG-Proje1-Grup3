import { describe, expect, it } from 'vitest'
import { getWeekStates } from '../weekState'

const week = (done: number, total: number) => ({ done, total })

describe('getWeekStates (#42)', () => {
  it('hiç görev tamamlanmamışsa ilk hafta şu anki haftadır', () => {
    expect(getWeekStates([week(0, 3), week(0, 2), week(0, 2)])).toEqual([
      'current',
      'upcoming',
      'upcoming',
    ])
  })

  it('tamamlanan haftalardan sonraki ilk hafta şu anki haftadır', () => {
    expect(getWeekStates([week(3, 3), week(1, 2), week(0, 2)])).toEqual([
      'done',
      'current',
      'upcoming',
    ])
  })

  it('ileride tamamlanmış bir hafta tamamlandı görünür, şu anki hafta geride kalan ilk eksik haftadır', () => {
    expect(getWeekStates([week(3, 3), week(0, 2), week(2, 2)])).toEqual(['done', 'current', 'done'])
  })

  it('bütün haftalar bittiyse şu anki hafta yoktur', () => {
    expect(getWeekStates([week(3, 3), week(2, 2)])).toEqual(['done', 'done'])
  })

  it('görevi olmayan hafta şu anki hafta sayılmaz', () => {
    expect(getWeekStates([week(0, 0), week(0, 2)])).toEqual(['upcoming', 'current'])
  })

  it('hafta yoksa boş liste döner', () => {
    expect(getWeekStates([])).toEqual([])
  })
})
