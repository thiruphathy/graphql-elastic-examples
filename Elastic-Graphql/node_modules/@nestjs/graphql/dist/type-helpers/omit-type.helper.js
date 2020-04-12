"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../decorators");
const get_fields_and_decorator_util_1 = require("../schema-builder/utils/get-fields-and-decorator.util");
const type_helpers_utils_1 = require("./type-helpers.utils");
function OmitType(classRef, keys, decorator) {
    const { fields, decoratorFactory } = get_fields_and_decorator_util_1.getFieldsAndDecoratorForType(classRef);
    class OmitObjectType {
    }
    if (decorator) {
        decorator({ isAbstract: true })(OmitObjectType);
    }
    else {
        decoratorFactory({ isAbstract: true })(OmitObjectType);
    }
    const isInheritedPredicate = (propertyKey) => !keys.includes(propertyKey);
    type_helpers_utils_1.inheritValidationMetadata(classRef, OmitObjectType, isInheritedPredicate);
    type_helpers_utils_1.inheritTransformationMetadata(classRef, OmitObjectType, isInheritedPredicate);
    fields
        .filter((item) => !keys.includes(item.schemaName))
        .forEach((item) => decorators_1.Field(item.typeFn, Object.assign({}, item.options))(OmitObjectType.prototype, item.name));
    return OmitObjectType;
}
exports.OmitType = OmitType;
