import {BlogRequestBody} from "../blog";

export class BlogEntity {
    private id?: string;
    private name: string;
    private description: string;
    private websiteUrl: string;
    private isMembership: boolean = false;

    constructor(params: { id?: string } & BlogRequestBody & { isMembership?: boolean }) {
        this.id = params.id; // важно!
        this.name = params.name;
        this.description = params.description;
        this.websiteUrl = params.websiteUrl;
        this.isMembership = params.isMembership ?? false;
    }

    static restore(params: { id: string } & BlogRequestBody & { isMembership: boolean }): BlogEntity {
        return new BlogEntity(params);
    }

    updateData(params: BlogRequestBody) {
        this.name = params.name;
        this.description = params.description;
        this.websiteUrl = params.websiteUrl;
    }

    toggleMembership() {
        this.isMembership = !this.isMembership;
    }

    getId() { return this.id }
    getName() { return this.name }
    getDescription() { return this.description }
    getWebsiteUrl() { return this.websiteUrl }
    getIsMembership() { return this.isMembership }

}

