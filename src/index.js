const {ApolloServer } = require("apollo-server")
const { PrismaClient } = require('@prisma/client')
const {getUserId } = require("./utils")
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient()
const { PubSub } = require("apollo-server")
const pubsub = new PubSub()
const resolvers = {Query, Mutation, User, Link}


// const resolvers = {
//     Query:{
//         info: () => `This is the API of a Hackernews Clone`,
         
//         getLink: (parent, args) =>{
//             return links.find(link => link.id == args.id )}
//     },

//     Mutation: {
        
//     // post: (parent, args, context, info) => {

//     //         const newlink = context.prisma.link.create({
//     //             data: {
//     //                 description: args.description,
//     //                 url: args.url
//     //             },
//     //         })
//     //         return newlink
//     //     },
//         updateLink: (parent, args) =>{
//             let updatedUser = links.find(link => link.id == args.id)
//             updatedUser = {
//                 id: args.id,
//                 description: args.description,
//                 url: args.url
//             }
//             return updatedUser
//         },
//         deleteLink: (parent, args) =>{
//             const linkIndex = links.findIndex(link => link.id === args.id)
//             const deletedLink = links.splice(linkIndex, 1)
//             return links[0]
//             // # return `link with id:${args.d} was deleted`
//         }
    
    
// }

  
// }

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
      ),
    resolvers,
    uploads:false,
    context: ({req}) => {
        return {
            ...req,
            prisma,
            pubsub,
            userId:
            req && req.headers.authorization
            ? getUserId(req)
            :null
        }
    }
})

server
    .listen()
    .then(({url}) =>
        console.log(`Server is running on ${url}`)
    );