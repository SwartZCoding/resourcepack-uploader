import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Pack extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public originalNameFile: string

  @column()
  public sha1 : string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
