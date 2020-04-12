"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../decorators");
const get_fields_and_decorator_util_1 = require("../schema-builder/utils/get-fields-and-decorator.util");
const type_helpers_utils_1 = require("./type-helpers.utils");
function PartialType(classRef, decorator) {
    const { fields, decoratorFactory } = get_fields_and_decorator_util_1.getFieldsAndDecoratorForType(classRef);
    class PartialObjectType {
    }
    if (decorator) {
        decorator({ isAbstract: true })(PartialObjectType);
    }
    else {
        decoratorFactory({ isAbstract: true })(PartialObjectType);
    }
    type_helpers_utils_1.inheritValidationMetadata(classRef, PartialObjectType);
    type_helpers_utils_1.inheritTransformationMetadata(classRef, PartialObjectType);
    fields.forEach((item) => {
        decorators_1.Field(item.typeFn, Object.assign(Object.assign({}, item.options), { nullable: true }))(PartialObjectType.prototype, item.name);
        type_helpers_utils_1.applyIsOptionalDecorator(PartialObjectType, item.name);
    });
    Object.defineProperty(PartialObjectType, 'name', {
        value: `Partial${classRef.name}`,
    });
    return PartialObjectType;
}
exports.PartialType = PartialType;
