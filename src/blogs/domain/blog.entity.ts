import {BlogRequestBody} from "../blog";

export class BlogEntity {
    private id?: string;
    private name: string;
    private description: string;
    private websiteUrl: string;
    private isMembership: boolean = false;

    constructor({
                    name,
                    description,
                    websiteUrl,
                    isMembership = false,
                    id,
                }: {
        name: string;
        description: string;
        websiteUrl: string;
        isMembership?: boolean;
        id?: string;
    }) {
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.isMembership = isMembership;
        this.id = id;
    }

    static restore({
                       id,
                       name,
                       description,
                       websiteUrl,
                       isMembership,
                   }: {
        id: string;
        name: string;
        description: string;
        websiteUrl: string;
        isMembership: boolean;
    }): BlogEntity {
        return new BlogEntity({ id, name, description, websiteUrl, isMembership });
    }

    updateData(params: BlogRequestBody) {
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
