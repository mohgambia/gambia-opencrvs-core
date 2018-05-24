import { importSchema } from 'graphql-import'
import { makeExecutableSchema } from 'graphql-tools'

import { resolvers as notificationResolvers } from 'src/features/notification/resolvers'
import { resolvers as registrationResolvers } from 'src/features/registration/resolvers'

export const getExecutableSchema = (schemaPath: string) => {
  const typeDefs = importSchema(schemaPath)
  return makeExecutableSchema({
    typeDefs,
    resolvers: [notificationResolvers, registrationResolvers]
  })
}
