import { Entity, Fields, IdEntity } from 'remult'

@Entity('templates', { allowApiCrud: true })
export class TemplateEntity extends IdEntity {
  @Fields.string()
  name = ''

  @Fields.json()
  data: object = {}

  @Fields.createdAt()
  createdAt = new Date()

  @Fields.updatedAt()
  updatedAt = new Date()
}
