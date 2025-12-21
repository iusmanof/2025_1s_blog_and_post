"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogEntity = void 0;
class BlogEntity {
    constructor(params) {
        var _a;
        this.isMembership = false;
        this.id = params.id;
        this.name = params.name;
        this.description = params.description;
        this.websiteUrl = params.websiteUrl;
        this.isMembership = (_a = params.isMembership) !== null && _a !== void 0 ? _a : false;
    }
    static restore(params) {
        return new BlogEntity(params);
    }
    updateData(params) {
        this.name = params.name;
        this.description = params.description;
        this.websiteUrl = params.websiteUrl;
    }
    toggleMembership() {
        this.isMembership = !this.isMembership;
    }
    getId() { return this.id; }
    getName() { return this.name; }
    getDescription() { return this.description; }
    getWebsiteUrl() { return this.websiteUrl; }
    getIsMembership() { return this.isMembership; }
}
exports.BlogEntity = BlogEntity;
//# sourceMappingURL=blog.entity.js.map