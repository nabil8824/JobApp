import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { approvedcompany, bancompany, unBancompany } from "./company.resolve.js";

export const companyMutationQuery={
    bancompany:{
        type: GraphQLString,
        args:{
            companyId:{type:new GraphQLNonNull(GraphQLID )},
            authorization:{type:GraphQLString}

        },
        resolve:bancompany
    },
    unBanUcompany:{
        type: GraphQLString,
        args:{
            companyId:{type:new GraphQLNonNull(GraphQLID )},
            authorization:{type:GraphQLString}

        },
        resolve:unBancompany
    },
    approvedcompany:{
        type: GraphQLString,
        args:{
            companyId:{type:new GraphQLNonNull(GraphQLID )}, 
            authorization:{type:GraphQLString}

        },
        resolve:approvedcompany
    }
    
}