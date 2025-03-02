import { GraphQLBoolean, GraphQLEnumType, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";


export const company = new GraphQLObjectType({
    name: "companyy",
    fields: {
        companyName: { type: GraphQLString },
        description: { type: GraphQLString },

        industry: { type: GraphQLString },
        address: { type: GraphQLString },
      companyEmail: { type: GraphQLString },
    
      isConfirmed: { type: GraphQLBoolean },
      isdeleted: { type: GraphQLBoolean },
      deletedAt: { type: GraphQLBoolean },
      
      isbanned:{ type: GraphQLBoolean},
      approvedByAdmin:{ type: GraphQLBoolean},
    changeCredentialTime: { type: GraphQLString }
    }
  });