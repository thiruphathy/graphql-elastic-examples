"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const graphql_1 = require("graphql");
const schema_generation_error_1 = require("./errors/schema-generation.error");
const mutation_type_factory_1 = require("./factories/mutation-type.factory");
const orphaned_types_factory_1 = require("./factories/orphaned-types.factory");
const query_type_factory_1 = require("./factories/query-type.factory");
const subscription_type_factory_1 = require("./factories/subscription-type.factory");
const lazy_metadata_storage_1 = require("./storages/lazy-metadata.storage");
const type_metadata_storage_1 = require("./storages/type-metadata.storage");
const type_definitions_generator_1 = require("./type-definitions.generator");
let GraphQLSchemaFactory = class GraphQLSchemaFactory {
    constructor(queryTypeFactory, mutationTypeFactory, subscriptionTypeFactory, orphanedTypesFactory, typeDefinitionsGenerator) {
        this.queryTypeFactory = queryTypeFactory;
        this.mutationTypeFactory = mutationTypeFactory;
        this.subscriptionTypeFactory = subscriptionTypeFactory;
        this.orphanedTypesFactory = orphanedTypesFactory;
        this.typeDefinitionsGenerator = typeDefinitionsGenerator;
    }
    create(resolvers, options = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            type_metadata_storage_1.TypeMetadataStorage.clear();
            lazy_metadata_storage_1.LazyMetadataStorage.load(resolvers);
            type_metadata_storage_1.TypeMetadataStorage.compile(options.orphanedTypes);
            this.typeDefinitionsGenerator.generate(options);
            const schema = new graphql_1.GraphQLSchema({
                mutation: this.mutationTypeFactory.create(resolvers, options),
                query: this.queryTypeFactory.create(resolvers, options),
                subscription: this.subscriptionTypeFactory.create(resolvers, options),
                types: this.orphanedTypesFactory.create(options.orphanedTypes),
                directives: options.directives,
            });
            if (!options.skipCheck) {
                const introspectionQuery = graphql_1.getIntrospectionQuery();
                const { errors } = yield graphql_1.graphql(schema, introspectionQuery);
                if (errors) {
                    throw new schema_generation_error_1.SchemaGenerationError(errors);
                }
            }
            return schema;
        });
    }
};
GraphQLSchemaFactory = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [query_type_factory_1.QueryTypeFactory,
        mutation_type_factory_1.MutationTypeFactory,
        subscription_type_factory_1.SubscriptionTypeFactory,
        orphaned_types_factory_1.OrphanedTypesFactory,
        type_definitions_generator_1.TypeDefinitionsGenerator])
], GraphQLSchemaFactory);
exports.GraphQLSchemaFactory = GraphQLSchemaFactory;
