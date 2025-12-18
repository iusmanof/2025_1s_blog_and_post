"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
class Blog {
    constructor(name, description, websiteUrl, isMembership = false) {
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.isMembership = isMembership;
    }
    updateData(params) {
        this.name = params.name;
        this.description = params.description;
        this.websiteUrl = params.websiteUrl;
    }
    toggleMembership() {
        this.isMembership = !this.isMembership;
    }
    getName() { return this.name; }
    getDescription() { return this.description; }
    getWebsiteUrl() { return this.websiteUrl; }
    getIsMembership() { return this.isMembership; }
}
exports.Blog = Blog;
//# sourceMappingURL=blog.dto.js.map