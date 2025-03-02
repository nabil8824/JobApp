import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { userMutationQuery, userQuery } from './users/graphQl/user.field.js';
import { companyMutationQuery } from './company/graphQl/company.field.js';


export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        ...userQuery,
          }
        }),
        mutation: new GraphQLObjectType({
          name:"mutation",
          fields:{
            ...userMutationQuery,
            ...companyMutationQuery,
          }
    })
  })
