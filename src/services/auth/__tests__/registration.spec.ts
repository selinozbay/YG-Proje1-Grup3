import { describe, expect, it } from 'vitest'
import { checkPasswordStrength, isStudentEmail } from '../registration'

describe('isStudentEmail (#6)', () => {
  it.each(['123456@ogr.ktu.edu.tr', '1@ogr.ktu.edu.tr', '2024123456@ogr.ktu.edu.tr'])(
    '%s öğrenci e-postası olarak kabul edilir',
    (email) => {
      expect(isStudentEmail(email)).toBe(true)
    },
  )

  it('baştaki ve sondaki boşluklar ile büyük harfli alan adı sorun olmaz', () => {
    expect(isStudentEmail('  123456@OGR.KTU.EDU.TR ')).toBe(true)
  })

  it.each([
    ['harf içeren kullanıcı adı', 'ali@ogr.ktu.edu.tr'],
    ['rakam ve harf karışık', '12345a@ogr.ktu.edu.tr'],
    ['nokta içeren kullanıcı adı', '123.456@ogr.ktu.edu.tr'],
    ['boş kullanıcı adı', '@ogr.ktu.edu.tr'],
    ['personel alan adı', '123456@ktu.edu.tr'],
    ['başka üniversite', '123456@ogr.odtu.edu.tr'],
    ['alan adının sonuna ek', '123456@ogr.ktu.edu.tr.com'],
    ['alan adının başına ek', '123456@x.ogr.ktu.edu.tr'],
    ['genel e-posta', '123456@gmail.com'],
    ['boş metin', ''],
  ])('%s reddedilir (%s)', (_, email) => {
    expect(isStudentEmail(email)).toBe(false)
  })
})

describe('checkPasswordStrength (#7)', () => {
  it.each([
    ['8 karakterden kısa', 'Ab1!xyz'],
    ['yalnızca küçük harf', 'parolaparola'],
    ['yalnızca rakam', '1234567890'],
    ['yalnızca büyük harf', 'PAROLAPAROLA'],
  ])('%s şifre zayıftır (%s)', (_, password) => {
    expect(checkPasswordStrength(password).level).toBe('weak')
  })

  it.each([
    ['8+ karakter, harf ve rakam', 'parola123'],
    ['8+ karakter, küçük ve büyük harf', 'ParolaParola'],
    ['10 karakterden kısa, üç tür', 'Parola12'],
  ])('%s orta düzeydedir (%s)', (_, password) => {
    expect(checkPasswordStrength(password).level).toBe('medium')
  })

  it.each([
    ['10+ karakter, küçük-büyük harf ve rakam', 'Parola2026'],
    ['10+ karakter, harf, rakam ve simge', 'parola-2026'],
    ['Türkçe harfler büyük ve küçük harf sayılır', 'Şifreğüç2026'],
  ])('%s güçlüdür (%s)', (_, password) => {
    expect(checkPasswordStrength(password).level).toBe('strong')
  })

  it('eksik olan her şey için Türkçe ipucu verir', () => {
    expect(checkPasswordStrength('parola').hints).toEqual([
      'En az 8 karakter kullanın.',
      'Büyük harf ekleyin.',
      'Rakam ekleyin.',
      'Simge ekleyin (ör. ! ? - #).',
    ])
  })

  it('güçlü şifrede de eksik türler için ipucu kalabilir, eksik yoksa ipucu yoktur', () => {
    expect(checkPasswordStrength('Parola2026').hints).toEqual(['Simge ekleyin (ör. ! ? - #).'])
    expect(checkPasswordStrength('Parola-2026').hints).toEqual([])
  })

  it('boş şifre zayıftır', () => {
    expect(checkPasswordStrength('').level).toBe('weak')
  })
})
