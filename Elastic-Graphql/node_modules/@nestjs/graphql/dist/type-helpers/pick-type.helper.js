"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../decorators");
const get_fields_and_decorator_util_1 = require("../schema-builder/utils/get-fields-and-decorator.util");
const type_helpers_utils_1 = require("./type-helpers.utils");
function PickType(classRef, keys, decorator) {
    const { fields, decoratorFactory } = get_fields_and_decorator_util_1.getFieldsAndDecoratorForType(classRef);
    class PickObjectType {
    }
    decoratorFactory({ isAbstract: true })(PickObjectType);
    if (decorator) {
        decorator({ isAbstract: true })(PickObjectType);
    }
    else {
        decoratorFactory({ isAbstract: true })(PickObjectType);
    }
    const isInheritedPredicate = (propertyKey) => keys.includes(propertyKey);
    type_helpers_utils_1.inheritValidationMetadata(classRef, PickObjectType, isInheritedPredicate);
    type_helpers_utils_1.inheritTransformationMetadata(classRef, PickObjectType, isInheritedPredicate);
    fields
        .filter((item) => keys.includes(item.schemaName))
        .forEach((item) => decorators_1.Field(item.typeFn, Object.assign({}, item.options))(PickObjectType.prototype, item.name));
    return PickObjectType;
}
exports.PickType = PickType;
