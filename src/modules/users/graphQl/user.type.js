import { GraphQLBoolean, GraphQLEnumType, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { company } from "../../company/graphQl/company.type.js";


  
  export const user = new GraphQLObjectType({
    name: "user",
    fields: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
      mobileNumber: { type: GraphQLString },
      role: { type: GraphQLString },
      provider: { type: GraphQLString },
      isConfirmed: { type: GraphQLBoolean },
      isdeleted: { type: GraphQLBoolean },
      deletedAt: { type: GraphQLBoolean },
      isbanned:{ type: GraphQLBoolean},
  
    }
  });
  export const UserCompanyType = new GraphQLObjectType({
    name: "UserCompany",
    fields: () => ({
      users: { type: new GraphQLList(user) }, 
      companies: { type: new GraphQLList(company) }, 
    }),
  });
  