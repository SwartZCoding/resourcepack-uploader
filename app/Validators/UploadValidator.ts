import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UploadValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    cover_image: schema.file({
      size: '40mb',
      extnames: ['zip'],
    }),
  })

  public messages: CustomMessages = {}
}
