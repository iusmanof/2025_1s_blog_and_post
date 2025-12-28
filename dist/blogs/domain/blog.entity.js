"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogEntity = void 0;
class BlogEntity {
    constructor({ name, description, websiteUrl, isMembership = false, id, }) {
        this.isMembership = false;
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.isMembership = isMembership;
        this.id = id;
    }
    static restore({ id, name, description, websiteUrl, isMembership, }) {
        return new BlogEntity({ id, name, description, websiteUrl, isMembership });
    }
    updateData(params) {
        this.name = params.name;
        this.description = params.description;
        this.websiteUrl = params.websiteUrl;
    }
    toggleMembership() {
        this.isMembership = !this.isMembership;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getDescription() {
        return this.description;
    }
    getWebsiteUrl() {
        return this.websiteUrl;
    }
    getIsMembership() {
        return this.isMembership;
    }
}
exports.BlogEntity = BlogEntity;
//# sourceMappingURL=blog.entity.js.map