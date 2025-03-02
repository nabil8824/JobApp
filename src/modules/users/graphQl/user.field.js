import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { banUser, getAllUsers, unBanUser } from "./user.resolve.js";
import {  UserCompanyType } from "./user.type.js";



export const userQuery={
    getAllUsers:{
        type: UserCompanyType,
        args:{
            authorization:{type:GraphQLString}
        },
        resolve:getAllUsers
    },

}
export const userMutationQuery={
    banUser:{
        type: GraphQLString,
        args:{
            userId:{type:new GraphQLNonNull(GraphQLID )},
            authorization:{type:GraphQLString}

        },
        resolve:banUser
    },
    unBanUser:{
        type: GraphQLString,
        args:{
            userId:{type:new GraphQLNonNull(GraphQLID )},
            authorization:{type:GraphQLString}

        },
        resolve:unBanUser
    }
    
}